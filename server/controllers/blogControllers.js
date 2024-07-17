import Blog from "../Schema/Blog.js";
import { nanoid } from "nanoid";
import User from "../Schema/User.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId; // Import ObjectId from mongoose

export const deleteBlogController = async (req, res) => {
  let authorId = req.user;
  let { _id, blog_id } = req.body;
  // console.log(blog_id, _id);
  const blogObjectId = new ObjectId(_id);
  // console.log(blogObjectId);

  Blog.findOneAndDelete({ blog_id, _id }).then((blog) => {
    User.findOneAndUpdate(
      { _id: authorId },
      {
        $inc: { "account_info.total_posts": -1 },
        $pull: { blogs: blogObjectId },
      }
    )
      .then((user) => {
        // Optionally handle success (e.g., log the user)
        return res
          .status(200)
          .json({ message: "Post deleted and User updated successfully" });
      })
      .catch((err) => {
        // Handle error during user update
        console.error(err);
        return res.status(500).json({
          error: "Failed to update user information after post deletion",
        });
      });
  });
};
/******* Controller For Creating Blog Data *******/
export const createBlogController = async (req, res) => {
  let authorId = req.user;
  let { title, des, banner, content, tags, draft, id } = req.body;

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
    id ||
    title
      .replace(/[^a-zA-Z0-9]/g, " ")
      .replace(/\s+/g, "-")
      .trim() + nanoid(); // If I have shit like #@#! replace them with empty, then -, plus a random generated ID
  console.log(blog_id);

  if (id) {
    Blog.findOneAndUpdate(
      { blog_id },
      { title, des, banner, content, tags, draft: draft ? draft : false }
    )
      .then((blog) => {
        return res.status(200).json({ id: blog_id });
      })
      .catch((err) => {
        err.message;
      });
  } else {
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
            // console.log(user);
            return res.status(200).json({ id: blog.blog_id });
          })
          .catch((err) => {
            // console.log(user); //take this off later
            return res
              .status(500)
              .json({ error: "failed to update total posts number" });
          });
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  }
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

export const getTrendingTagsController = async (req, res) => {
  try {
    const result = await Blog.aggregate([
      { $unwind: "$tags" }, // Split the tags array into separate documents
      { $group: { _id: "$tags", count: { $sum: 1 } } }, // Group by tag and count occurrences
      { $sort: { count: -1, _id: 1 } }, // Sort by count in descending order
      { $limit: 10 }, // Limit to top 8
    ]);
    const topTags = result.map((item) => item._id); // Extract tag names
    return res.status(200).json({ topTags });
  } catch (error) {
    console.error("Error getting top tags:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Used for 2 different functionalities:
// 1. Search function
// 2. searching by tag for the related post function
export const searchBlogsController = async (req, res) => {
  let { tag, page, author, query, eliminate_current_blog } = req.body;
  let findQuery;

  if (tag) {
    findQuery = {
      tags: tag,
      draft: false,
      blog_id: { $ne: eliminate_current_blog },
    };
  } else if (query) {
    // console.log("runing else", query);
    findQuery = { draft: false, title: new RegExp(query, "i") };
    // console.log(findQuery);
  } else if (author) {
    findQuery = { draft: false, author };
  }

  // console.log(findQuery);

  let maxLimit = 5;

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
