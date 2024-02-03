import User from "../Schema/User.js";
import bcrypt from "bcrypt";
import {
  formatDataToSend,
  emailRegex,
  passwordRegex,
  generatedUsername,
} from "../utils.js";

export const signupController = async (req, res) => {
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
};

export const signinController = async (req, res) => {
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
};
