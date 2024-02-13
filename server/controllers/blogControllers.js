import Blog from "../Schema/Blog.js";
import { nanoid } from "nanoid";
import User from "../Schema/User.js";

/******* Controller For Creating Blog Data *******/
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

/******* Controller For Blog *******/

export const getLatestBlogsController = async (req, res) => {
  let { page } = req.body;
  let maxLimit = 5;

  Blog.find({ draft: false })
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname -_id"
    )
    .sort({ publishedAt: -1 })
    .select("blog_id title des banner tags publishedAt activity -_id")
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

export const getTrendingBlogsController = async (req, res) => {
  Blog.find({ draft: false })
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname -_id"
    )
    .sort({
      "activity.total_read": -1,
      "activity.total_likes": -1,
      publishedAt: -1,
    })
    .select("blog_id title publishedAt  -_id")
    .limit(5)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

export const searchBlogsController = async (req, res) => {
  let { tag, page, author, query } = req.body;
  let findQuery;

  if (tag) {
    findQuery = { tags: tag, draft: false };
  } else if (query) {
    // console.log("runing else", query);
    findQuery = { draft: false, title: new RegExp(query, "i") };
    // console.log(findQuery);
  } else if (author) {
    findQuery = { draft: false, author };
  }

  // console.log(findQuery);

  let maxLimit = 2;

  Blog.find(findQuery)
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname -_id"
    )
    .sort({ publishedAt: -1 })
    .select("blog_id title des banner tags publishedAt activity -_id")
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then((blogs) => {
      console.log(blogs);
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

export const searchUsersController = async (req, res) => {
  let { query } = req.body;

  User.find({
    $or: [
      { "personal_info.username": new RegExp(query, "i") },
      { "personal_info.fullname": new RegExp(query, "i") },
    ],
  })
    .limit(50)
    .select(
      "personal_info.username personal_info.fullname personal_info.profile_img -_id"
    )
    .then((users) => {
      return res.status(200).json({ users });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

export const searchBlogsCountController = async (req, res) => {
  let { tag, author, query } = req.body;
  let findQuery;
  if (tag) {
    findQuery = { tags: tag, draft: false };
  } else if (query) {
    console.log("runing else", query);
    findQuery = { draft: false, title: new RegExp(query, "i") };
    console.log(findQuery);
  } else if (author) {
    findQuery = { draft: false, author };
  }

  Blog.countDocuments(findQuery)
    .then((count) => {
      return res.status(200).json({ totalDocs: count });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

export const allLatestBlogsCountController = async (req, res) => {
  Blog.countDocuments({ draft: false })
    .then((count) => {
      return res.status(200).json({ totalDocs: count });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};
