const express = require('express');              //import express
const mongoose = require("mongoose");             //import mongoose
const morgan = require("morgan");               //import morgan
const path = require("path");                   //import path
const cors = require("cors");                   //import cors

 
const app = express();                         //create an express app

app.use(morgan("dev")); //this will be used in app.use("/adminIncidentApi", AdminRoutesForIncidents);only dev mood only
app.use(                                        //use cors
  cors({
    origin: ["http://localhost:3000"],          //allow only localhost:3000
    credentials: true,                          //allow credentials
  })
);
app.use(express.json({ limit: "500mb" }));      //limit the size of the json file to 500mb
app.use(express.urlencoded({ limit: "500mb", extended: true }));        //limit the size of the url file to 500mb

app.use("/public//images//", express.static(path.join("public/images/")));    //use static files from the public folder
app.use("/public/images/", express.static(path.join("public/images/")));      //use static files from the public folder
app.use("/public\\images\\", express.static(path.join("public/images/")));  //use static files from the public folder

app.get("/", (req, res) => {                  //get the root of the server
  res.send("welcome to Library Mngmt Backend"); //send the welcome message
});

const userRoutes = require("../Routes/UserRoutes"); //import user routes
const AdminRoutes = require("../Routes/AdminRoutes"); //import admin routes

app.use("/user", userRoutes);             //use the user routes
app.use("/admin", AdminRoutes);             //use the admin routes
 //except the above routes,let's caught it
app.all("*", (req, res, next) => {              //catch all the routes
  console.log(`Can't find route ${req.originalUrl} on server`);
});

var Port = process.env.PORT || 1000;          //set the port
app.listen(Port, () => {                      //listen to the port
  console.log(`server is listening at port ${Port}`);     //log the port
});


//database connection
//mongoose.connect is for connecting to the database using the mongo url from the mongodb
mongoose.connect("mongodb+srv://library:library@cluster0.czrrwpa.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,                //use new url parser
    useUnifiedTopology: true,             //use unified topology
    useFindAndModify: false,              //use find and modify
  })
  .then(() => console.log("Database connected"))  //if connected, log the database connected
  .catch((err) => console.log(`DB connection failed ${err}`));    //if not connected, log the error
mongoose.set("useNewUrlParser", true);    //set the useNewUrlParser to true
mongoose.set("useCreateIndex", true);     //set the useCreateIndex to true
