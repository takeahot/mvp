var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

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
app.use("/users", usersRouter);

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

//set work folder
const folder_name = 'script';

//import lib
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const fs = require("fs");
// const path = require('path');

const diff = require('diff');

//general util


//programm util
//get text from dcox file and put it to string
function getTextFromDoc (file_path) {
  //read file into var binary format
  let content = fs.readFileSync(file_path, "binary");
  //unzip content
  let zip = new PizZip(content);
  //convert open office xml to docxtemplate object 
  let doc;
  try {
    doc = new Docxtemplater(zip);
  } catch (error) {
    // Catch compilation errors (errors caused by the compilation of the template : misplaced tags)
    errorHandler(error);
  }
  //return text from docxtemplate object
  return doc.getFullText();
}

function compareToEach (arrFileListAndCompareList) {
  //put each part of argument in var 
  let arrFiles = arrFileListAndCompareList[0];
  // if last element just put result 
  if (arrFiles.length -1) {
    //convert file names to file paths 
    let pathAllFiles = arrFiles.map(filename => path.resolve(__dirname,'../../Downloads/'+folder_name+'/'+filename));
    //convert file paths to file texts 
    let textAllFiles = pathAllFiles.map(filepath => getTextFromDoc(filepath));
    //get first text and file name
    let textFirstFile = textAllFiles[0];
    textAllFiles = textAllFiles.slice(1);
    let nameFirstFile = arrFiles[0];
    arrFiles = arrFiles.slice(1);
    //compare first file with another
    let compareArr = textAllFiles.map(filetext => diff.diffWords(textFirstFile,filetext,true));
    let compareList = compareToEach([arrFiles,arrFileListAndCompareList[1]]);
    compareList = compareList.concat(compareArr.map((compareObj,index) => jes = [[nameFirstFile,  arrFiles[index]].sort(),compareObj]));
    return compareList;
  } else {
    return arrFileListAndCompareList[1];
  }
}

let fileArr = [];
let workingFolderPath = path.resolve(__dirname,'../../Downloads/'+folder_name);
fileArr = fs.readdirSync(workingFolderPath);

let fileTextArr = fileArr.map(fileName => getTextFromDoc(workingFolderPath+'/'+fileName));

resultArr = compareToEach ([fileArr,[]]);
resultArr.forEach(couple => 
  {
    console.log(couple[0]);
    console.log(couple[1].filter(obj => (!('added' in obj) && (obj.value != ' '))));
  })
// console.log(resultArr[0]);
let compare = diff.diffWords(fileTextArr[0],fileTextArr[1],true);