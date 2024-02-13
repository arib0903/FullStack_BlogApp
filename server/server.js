import express from "express";
import mongoose, { get } from "mongoose";
import "dotenv/config";
import cors from "cors";
import {
  signinController,
  signupController,
} from "./controllers/userControllers.js";
import {
  allLatestBlogsCountController,
  createBlogController,
  getLatestBlogsController,
  getTrendingBlogsController,
  searchBlogsCountController,
  searchUsersController,
} from "./controllers/blogControllers.js";
import { verifyJWT } from "./middleware/verifyJWT.js";
import { generateUploadURLController } from "./controllers/authControllers.js";
import { searchBlogsController } from "./controllers/blogControllers.js";
import Blog from "./Schema/Blog.js";
import { getProfileController } from "./controllers/profileControllers.js";
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

/*************************************************** ROUTES FOR GETTNG BLOGS **********************************************************************/
server.post("/latest-blogs", getLatestBlogsController); // gets the latest blogs

server.post("/search-blogs", searchBlogsController); // gets all the blogs that has certain tags and not a draft

server.post("/search-users", searchUsersController);
server.post("/get-profile", getProfileController);
server.get("/trending-blogs", getTrendingBlogsController); // gets all the trending blogs

server.post("/all-latest-blogs-count", allLatestBlogsCountController); // gets the count of all latest blogs that's not a draft

server.post("/search-blogs-count", searchBlogsCountController); // gets the count of all blogs that has certain tags and not a draft

server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
