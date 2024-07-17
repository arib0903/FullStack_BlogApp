import mongoose, { Schema } from "mongoose";

const testSchema = mongoose.Schema({
  blog_id: {
    type: String,
    required: true,
  },
  user_email: {
    type: String,
    required: true,
  },
  liked: {
    type: Boolean,
    // required: true,
  },
});

export default mongoose.model("LikedPosts", testSchema);
