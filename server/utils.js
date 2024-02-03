export const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
import aws from "aws-sdk";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import "dotenv/config";
import User from "./Schema/User.js";

export const generatedUsername = async (email) => {
  let username = email.split("@")[0];
  let isUsernameExists = await User.exists({
    "personal_info.username": username,
  }).then((result) => result);

  isUsernameExists ? (username += nanoid().substring(0, 5)) : ""; //adds a random string to a username if a email with that user already exists
  return username;
};

export const formatDataToSend = (user) => {
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

/***************************************************SETTING UP S3 BUCKET(CONNECTING TO AWS) **********************************************************************/
const s3 = new aws.S3({
  region: "us-east-2",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
/***************************************************GENERATE URL FOR PICTURE UPLOADS **********************************************************************/
export const generateUploadURL = async () => {
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
