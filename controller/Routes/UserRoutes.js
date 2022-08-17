const express = require("express");                         //import express
const router = express.Router();                                            //import router
const userController = require("../Controller/UserController");             //import userController

router.route("/signup").post(userController.SignUp);                      //signup user front the signup function in usercontroller
router.route("/login").post(userController.Login);                        //login user front the login function in usercontroller
router.route("/buyBook").post(userController.buyBook);                    //buy book front the buyBook function in usercontroller
router.route("/profileupdate/:_id").post(userController.profileupdate);   //update profile front the profileupdate function in usercontroller
router.route("/getProfileData/:_id").get(userController.getProfileData);  //get profile data front the getProfileData function in usercontroller
router.route("/filterBooks").get(userController.filterBooks);             //filter books front the filterBooks function in usercontroller
router.route("/singleBook/:_id").get(userController.singleBook);          //single book front the singleBook function in usercontroller
router.route("/rateNow/:_id/:rating").post(userController.rateNow);       //rate book front the rateNow function in usercontroller
router.route("/postComment/:_id").post(userController.postComment);       //post comment front the postComment function in usercontroller
router.route("/getcomments:_id").get(userController.getcomments);         //get comments front the getcomments function in usercontroller
router.route("/getusers").get(userController.getusers);                   //get users front the getusers function in usercontroller
router.route("/deleteUser/:_id").delete(userController.deleteUser);       //delete user front the deleteUser function in usercontroller
router.route("/getRentalDetails").post(userController.getRentalDetails);  //get rental details front the getRentalDetails function in usercontroller
router.route("/getRentalDetails/:_id").get(userController.getRentalDetailsSingleUser); //get rental details front the getRentalDetails function in usercontroller

module.exports = router;    //export the router for the user routes
