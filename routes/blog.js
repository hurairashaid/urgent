const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const cors = require("cors");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + "." + file.mimetype.split("/")[1]
    );
  },
});

const upload = multer({ storage: storage });

app.use(
  cors({
    origin: "http://192.168.0.37:8083",
    credentials: true,
  })
);
const { showBlog, CreateBlog , showOneBlog } = require("../controller/blog");

router.route("/showBlog").post(showBlog);
router.route("/showOneBlog").post(showOneBlog);
router.route("/createBlog").post(upload.array("images"), CreateBlog);

module.exports = router;
