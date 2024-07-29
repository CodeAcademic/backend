require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const postRoute = require('./src/routes/post.route')
const fileUpload = require('express-fileupload')
const path = require('path')

const app = express();
app.use(express.json());
app.use(fileUpload({}))

// Routes 
app.use("/api/post", require('./src/routes/post.route'));
// app.use("/static", express.static(path.join(__dirname, "static")));

const PORT = process.env.PORT || 3000;

const bootstrap = async () => {
  try {
    await mongoose
      .connect(process.env.DB_URL)
      .then(() => console.log("Connect DB"));
    app.listen(PORT, () =>
      console.log(`Listening on - http://localhost:${PORT}`)
    );
  } catch (error) {
    console.log(`Error connecting with DB:${error}`);
  }
};

bootstrap();
