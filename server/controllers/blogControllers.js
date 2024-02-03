import Blog from "../Schema/Blog.js";
import { nanoid } from "nanoid";
import User from "../Schema/User.js";

export const createBlogController = async (req, res) => {
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
};
