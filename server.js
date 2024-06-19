const express = require("express");
const { urlencoded, json } = require("body-parser");
const session = require("express-session");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

//connect to mongodb
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(urlencoded({ extended: true }));
app.use(json());
app.set("view engine", "ejs");

//middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.use("", require("./routes/routes"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
