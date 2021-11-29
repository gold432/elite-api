require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
const cors = require("cors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const db = require("./model");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const busRouter = require("./routes/bus.route");
const authRouter = require("./routes/auth.route");
const emailRouter = require("./routes/email");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/user", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/bus", busRouter);
app.use("/api/email", emailRouter);


// Syncing The Database Tables
db.sequelize.sync()
.then(async () => {
  try {
    const user = await db.roles.create({ roleName: "user" });
    const agent = await db.roles.create({ roleName: "agent" });
    const admin = await db.roles.create({ roleName: "admin" });

    if (user && agent && admin) {
    console.log("Roles Created");
    }
  } catch (err) {
    console.log(err.message);
  }
})
.catch((err) => {
  console.error(err.message || "Something went wrong");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
