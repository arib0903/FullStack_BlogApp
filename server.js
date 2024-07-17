import express from "express";
import mongoose, { get } from "mongoose";
import "dotenv/config";
import cors from "cors";
import {
  signinController,
  signupController,
} from "./server/controllers/userControllers.js";
import {
  allLatestBlogsCountController,
  createBlogController,
  deleteBlogController,
  getLatestBlogsController,
  getTrendingBlogsController,
  getTrendingTagsController,
  searchBlogsCountController,
  searchUsersController,
} from "./server/controllers/blogControllers.js";
import { verifyJWT } from "./server/middleware/verifyJWT.js";
import { generateUploadURLController } from "./server/controllers/authControllers.js";
import { searchBlogsController } from "./server/controllers/blogControllers.js";
import Blog from "./server/Schema/Blog.js";
import User from "./server/Schema/User.js";
import Test from "./server/Schema/Test.js";

import { getProfileController } from "./server/controllers/profileControllers.js";
const server = express();
let PORT = 3000;
// let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
// let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json()); //middleware to accept and send the json data
server.use(cors()); //enable the server to accept data from anywhere

/***************************************************CONNECTING THE DB **********************************************************************/
mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});

/***************************************************UPLOAD IMAGE URL ROUTE**********************************************************************/
server.get("/get-upload-url", generateUploadURLController);

/*************************************************** MAKING ROUTES FOR AUTH**********************************************************************/
//req = data from the front end
//res = response sending y frontened
server.post("/signup", signupController);
server.post("/signin", signinController);

/*************************************************** ROUTES FOR PUBLISHING/DRAFT POST **********************************************************************/
server.post("/create-blog", verifyJWT, createBlogController);
server.post("/delete-blog", verifyJWT, deleteBlogController);

/*************************************************** ROUTES FOR GETTNG BLOGS **********************************************************************/
server.post("/latest-blogs", getLatestBlogsController); // gets the latest blogs

server.post("/search-blogs", searchBlogsController); // gets all the blogs that has certain tags and not a draft

server.post("/search-users", searchUsersController);
server.post("/get-profile", getProfileController);
server.get("/trending-blogs", getTrendingBlogsController); // gets all the trending blogs
server.get("/get-trending-tags", getTrendingTagsController);

server.post("/all-latest-blogs-count", allLatestBlogsCountController); // gets the count of all latest blogs that's not a draft

server.post("/search-blogs-count", searchBlogsCountController); // gets the count of all blogs that has certain tags and not a draft

server.post("/get-blog", (req, res) => {
  let { blog_id, draft, mode } = req.body;
  let incrementalVal = mode != "edit" ? 1 : 0;

  Blog.findOneAndUpdate(
    { blog_id },
    { $inc: { "activity.total_reads": incrementalVal } }
  )
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname"
    )
    .select("title des banner activity content publishedAt tags blog_id")
    .then((blog) => {
      User.findOneAndUpdate(
        { "personal_info.username": blog.author.personal_info.username },
        { $inc: { "account_info.total_reads": incrementalVal } }
      ).catch((err) => {
        return res.status(500).json({ error: err.message });
      });
      if (blog.draft && !draft) {
        return res.status(500).json({ error: "you cannot access draft blogs" });
      }

      return res.status(200).json({ blog });
    }).catch = (err) => {
    return res.status(500).json({ error: err.message });
  };
}); //this function finds the blog by the blog_id and then finds the user that is related to the blog itself

server.post("/like-blog", verifyJWT, (req, res) => {
  let user_id = req.user;
  let { _id, islikedByUser, total_likes } = req.body;
  console.log(total_likes, islikedByUser);

  // let incrementalVal = islikedByUser ? -1 : 1;

  Blog.findOneAndUpdate({ _id }, { "activity.total_likes": total_likes }).then(
    (blog) => {
      // if (!islikedByUser) {
      //   let like = new Notification();
      // }
      return res.status(200).json({ message: "Post Liked", islikedByUser });
    }
  );
});

server.post("/test", (req, res) => {
  let body = req.body;
  console.log(body);
  // Test.save(body)
  //   .then((data) => {
  //     return res.status(200).json({ message: "data saved" });
  //   })
  //   .catch((err) => {
  //     return res.status(500).json({ error: err.message });
  //   });
  Test.create(body);
});

server.get("/test", async (req, res) => {
  const data = await Test.find();
  res.status(200).json(data);
});

// server.post("isLiked-by-user", verifyJWT, (req, res) => {
//   let user_id = req.user;
//   let { _id } = req.body;
// });
server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
