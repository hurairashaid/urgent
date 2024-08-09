const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  blog: {
    type: String,
    required: true,
  },
   Imageurl: {
    type: String,
    required: true,
  },

  Date: {
    type: String,
    required: true,
    unique: true,
  },
});

const Blog = mongoose.model("blog", blogSchema);

module.exports = Blog;
