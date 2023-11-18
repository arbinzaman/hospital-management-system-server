const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;

const app = require("./app");

mongoose
  .connect(
    "mongodb+srv://hms:a1s1d1f1@cluster0.sbauxbs.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Database is connected");
  });

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
