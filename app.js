require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const requestTime = require("./src/middlewares/request-time");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const errorMiddleware = require("./src/middlewares/error.middleware");
const cors = require('cors')

const app = express();

app.use(cors())
app.use(requestTime);
app.use(express.json());
app.use(fileUpload({}));
app.use(cookieParser({}));
app.use(morgan("dev"));
app.use(express.static("static"));

// Routes
app.use("/api/post", require("./src/routes/post.route"));
app.use("/api/auth", require("./src/routes/auth.route"));

app.use(errorMiddleware)

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
