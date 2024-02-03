import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import {
  signinController,
  signupController,
} from "./controllers/userControllers.js";
import { createBlogController } from "./controllers/blogControllers.js";
import { verifyJWT } from "./middleware/verifyJWT.js";
import { generateUploadURLController } from "./controllers/authControllers.js";
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

/*************************************************** MAKING ROUTES FOR SIGN UP**********************************************************************/
//req = data from the front end
//res = response sending y frontened
server.post("/signup", signupController);

/*************************************************** MAKING ROUTES FOR SIGN IN**********************************************************************/
server.post("/signin", signinController);

/*************************************************** ROUTES FOR PUBLISH **********************************************************************/
server.post("/create-blog", verifyJWT, createBlogController);
server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
