const Blog = require("../models/blog");
const { query, check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { uploadOnCloudinary } = require("../Utility/cloudinary");

const showBlog = async (req, res) => {
  try {
    const myData = await Blog.find().exec();
    if (myData) {
      res.json(myData);
    }
  } catch (error) {
    console.log(error);
  }
};

const showOneBlog = async (req, res) => {
  try {
    // Extract the blog ID from the request parameters
    const id = req.body._id;

    // Find the blog post by its ID
    const blogPost = await Blog.findById(id).exec();

    // Check if the blog post was found
    if (blogPost) {
      res.json(blogPost);
    } else {
      res.status(404).json({ message: "Blog post not found" });
    }
  } catch (error) {
    console.error("Error retrieving blog post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const CreateBlog = async (req, res) => {
  uploadOnCloudinary(req.files[0].path) // Explicitly return the promise here
    .then(async (url) => {
      try {
        const blog = req.body.blog;
        const image = req.body.image;
        const date = req.body.date;

        const myData = new Blog({
          blog: blog,
          Imageurl: url,
          Date: date,
        });

        // Save the new issue to the database
        const saved = await myData.save();

        res.status(201).json({
          success: true,
          user: saved,
        });
      } catch (error) {
        console.error("Error creating User:", error);
        res.status(500).json({
          success: false,
          error: "Internal Server Error",
        });
      }
    })
    .catch((error) => {
      console.error("Error uploading file:", error);
    });
};
module.exports = {
  showBlog,
  CreateBlog,
  showOneBlog,
};
