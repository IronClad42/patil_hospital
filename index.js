const express = require("express");
const bodyparser = require("body-parser");
const multer = require("multer");
var upload = require("express-fileupload");
const session = require("express-session");
const admin = require("./routes/admin");
const user = require("./routes/user");
const app = express();


app.use(upload())
app.use(express.static("public/"));


app.use(bodyparser.urlencoded({extended:true}));
app.use(session({
    secret: "patil_hopital",
    resave: true,
    saveUninitialized: true
}));

app.use("/admin", admin);
app.use("/", user);

app.listen(1000 , () => console.log("Server started on port 1000"));
