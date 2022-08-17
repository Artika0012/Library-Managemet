const express = require("express");                             //import express
const router = express.Router();                                                    //import router
const AdminUserController = require("../Controller/AdminUserController");       //import AdminUserController

//1.Addbooks by admin

router.route("/addbooks/").post(AdminUserController.addBooks);       //add books by admin fromt the addbooks function in admincontroller
router.route("/getbooks/").get(AdminUserController.getBooks);        //get books by admin fromt the getbooks function in admincontroller
router.route("/deleteBook/:_id").delete(AdminUserController.deleteBook); //delete books by admin fromt the deleteBook function in admincontroller

module.exports = router;    //export the router for the admin routes
