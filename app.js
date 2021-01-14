var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var logRouter = require("./routes/log");
var usersRouter = require("./routes/users");
var diffDocRouter = require("./routes/diffdoc");
var make_scirpt_by_VS = require('./routes/write_script_by_VS');
var test_script_befor_send = require('./routes/test_script_befor_send');
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use ("/log", logRouter);
app.use("/users", usersRouter);
app.use("/diff",diffDocRouter);
app.use('/script',make_scirpt_by_VS);
app.use('/test',test_script_befor_send);

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
  res.render("error", { title: "error" });
});

module.exports = app;