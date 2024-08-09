const mongoose = require("mongoose");

url =
  "mongodb+srv://huraira:Usama10091@cluster0.hnawam1.mongodb.net/huraira?retryWrites=true&w=majority&appName=Cluster0";
const connectDB = () => {
  console.log("we are in database");
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;
