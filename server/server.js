import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import User from "./Schema/User.js";
import Blog from "./Schema/Blog.js";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from "cors";
import aws from "aws-sdk";
const server = express();
let PORT = 3000;
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json()); //middleware to accept and send the json data
server.use(cors()); //enable the server to accept data from anywhere

/***************************************************CONNECTING THE DB **********************************************************************/
mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});

/***************************************************SETTING UP S3 BUCKET(CONNECTING TO AWS) **********************************************************************/
const s3 = new aws.S3({
  region: "us-east-2",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

/***************************************************GENERATE URL FOR PICTURE UPLOADS **********************************************************************/
const generateUploadURL = async () => {
  const date = new Date();
  const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

  //want a URL that will have the putObject functionality
  //Key = name of the file
  //This is async because we have to wait for the URL to be generated before returning it
  return await s3.getSignedUrlPromise("putObject", {
    Bucket: "fulstack-blogging-website",
    Key: imageName,
    Expires: 1000,
    ContentType: "image/jpeg",
  });
};

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // will be: "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1]; //if authheader exist, then asssign it the token

  if (token == null) {
    return res.status(401).json({ error: "No Access Token" });
  }

  //user = { id: user._id }
  jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Access Token is invalid" });
    }
    req.user = user.id;
    next();
  });
};

/***************************************************FORMATING THE DATA **********************************************************************/
const formatDataToSend = (user) => {
  //param 1: what data I want to convert to token
  //param 2: a private key to encrypt the data and hash the JWT
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );

  //sending this back to the front end
  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
    test: "test",
  };
};

/***************************************************GENERATING USERNAME**********************************************************************/
const generatedUsername = async (email) => {
  let username = email.split("@")[0];
  let isUsernameExists = await User.exists({
    "personal_info.username": username,
  }).then((result) => result);

  isUsernameExists ? (username += nanoid().substring(0, 5)) : ""; //adds a random string to a username if a email with that user already exists
  return username;
};

/***************************************************UPLOAD IMAGE URL ROUTE**********************************************************************/
server.get("/get-upload-url", async (req, res) => {
  generateUploadURL()
    .then((url) => res.status(200).json({ uploadUrl: url }))
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.message });
    });
});

/*************************************************** MAKING ROUTES FOR SIGN UP**********************************************************************/
//req = data from the front end
//res = response sending y frontened
server.post("/signup", (req, res) => {
  //destructuring the data from the front end(req.body)
  let { fullname, email, password } = req.body;
  console.log("THis is content type ", req.get("Content-Type"));

  /*Validating the data from the front end:*/
  if (fullname.length < 3) {
    return res.status(403).json({ error: "fullname must be 3 letters long" });
  }

  if (!email.length) {
    return res.status(403).json({ error: "enter email" });
  }

  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "email is invalid" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      error:
        "password should be 6-20 chars long with numeric, 1 lowercase and 1 uppercase letters",
    });
  }
  //hashing the password:
  bcrypt.hash(password, 10, async (err, hashed_password) => {
    let username = await generatedUsername(email);

    //create a user:
    let user = new User({
      personal_info: {
        fullname,
        email,
        password: hashed_password,
        username,
      },
    });

    //Saving the user & sending the data to the front end: via "formatDataToSend" function
    //since the user.save is a promise, we do .then to be able to do the next thing
    //userStored = what you get when you do user.save
    user
      .save()
      .then((userStored) => {
        return res.status(200).json(formatDataToSend(userStored)); //sends this the user data to frontend
      })
      .catch((err) => {
        if (err.code === 11000) {
          return res.status(403).json({ error: "email already exists" });
        }
        return res.status(500).json({ error: err.message });
      });

    // console.log(hashed_password);
  });

  //   if (email.length) return res.status(200).json({ status: "success" });
});

/*************************************************** MAKING ROUTES FOR SIGN IN**********************************************************************/
server.post("/signin", (req, res) => {
  let { email, password } = req.body;

  //Findin the email if in DB:
  User.findOne({ "personal_info.email": email })
    .then((user) => {
      //checks if the user is null... meaning that there was no email registered in the DB
      if (!user) {
        return res.status(403).json({ error: "Email not registered" });
      }

      bcrypt.compare(password, user.personal_info.password, (err, result) => {
        if (err) {
          return res.status(403).json({
            error: "Error occured while logging in, please try again",
          });
        }
        if (!result) {
          return res.status(403).json({ error: "password is incorrect" });
        } else {
          return res.status(200).json(formatDataToSend(user));
        }
      });

      //   return res.status(200).json({ status: "GOT USER INFO" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.message });
    });
});

/*************************************************** ROUTES FOR PUBLISH **********************************************************************/
server.post("/create-blog", verifyJWT, (req, res) => {
  let authorId = req.user;
  let { title, des, banner, content, tags, draft } = req.body;

  if (!title.length) {
    return res.status(403).json({ error: "Title is required" });
  }

  if (!draft) {
    if (!des.length || des.length > 200) {
      return res.status(403).json({
        error: "Description is required and should be less than 200 characters",
      });
    }

    if (!banner.length) {
      return res
        .status(403)
        .json({ error: "Banner is required to publish it" });
    }

    if (!content.blocks.length) {
      return res
        .status(403)
        .json({ error: "Blog Content is required to publish it" });
    }

    if (!tags.length || tags.length > 10) {
      return res
        .status(403)
        .json({ error: "Tags are required and should max 10" });
    }
  }
  tags = tags.map((tag) => tag.toLowerCase());

  let blog_id =
    title
      .replace(/[^a-zA-Z0-9]/g, " ")
      .replace(/\s+/g, "-")
      .trim() + nanoid(); // If I have shit like #@#! replace them with empty, then -, plus a random generated ID
  console.log(blog_id);

  let blog = new Blog({
    title,
    des,
    banner,
    content,
    tags,
    author: authorId,
    blog_id,
    draft: Boolean(draft),
  });

  blog
    .save()
    .then((blog) => {
      let incrementVal = draft ? 0 : 1;
      User.findOneAndUpdate(
        { _id: authorId },
        {
          $inc: { "account_info.total_posts": incrementVal },
          $push: { blogs: blog._id },
        }
      )
        .then((user) => {
          console.log(user);
          return res.status(200).json({ id: blog.blog_id });
        })
        .catch((err) => {
          console.log(user); //take this off later
          return res
            .status(500)
            .json({ error: "failed to update total posts number" });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });

  // return res.json({ status: "done" });
});

// start the server:
server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
