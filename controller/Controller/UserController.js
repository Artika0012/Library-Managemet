const UserModel = require("../Models/UserModel");
const BooksModel = require("../Models/BooksModel");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

//* This file is for the users only *//

// generate a token function
// const genToken = (id) => {
//   const token = jwt.sign({ id }, "thisissecretkey");
//   return token;
// };

//*************************************************************************************************************************** */
//*************************************************************************************************************************** */
//*************************************************************************************************************************** */

// 1.User SignUp
exports.SignUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;      //req.body is an object that contains all the data that we send from the frontend
    
    //if user exists
    const userAlreadyExists = await UserModel.findOne({ email }); 
    //findOne is a mongoose method that returns a promise so we use await keyword to wait for the promise to resolve

    if (userAlreadyExists) {                //if user already exists
      res.json({
        userExists: "User Already exists",  //send this message to the frontend
      });
      return;
    }

    var hashPwd = await bcrypt.hash(password, 10); //hash the password
    // create a new user
    const userSignedup = await UserModel.create({ 
      name,
      email,
      password: hashPwd,
      role: role === "admin" ? "admin" : "user",
    });

    // const token = genToken(userSignedup._id);

    if (userSignedup) {                           //if user signedup successfully
      res.json({
        success: true,                          
        message: "Account created Successfuly", //send this message to the frontend
        userDetails: userSignedup,
        // token
      });
    }
  } catch (error) {                                  //if error found
    console.log("Err in signup function()", error);  //log the error
    res.json({
      success: false,
      message: "Err in signup function()",          //send this message to the frontend
    });
  }
};


//*************************************************************************************************************************** */
//*************************************************************************************************************************** */
//*************************************************************************************************************************** */


// 2.User Login
exports.Login = async (req, res) => {   
  try {
    const { email, password } = req.body;   //req.body is an object that contains all the data that we send from the frontend
    const findUser = await UserModel.findOne({ email }); 
    //findOne is a mongoose method that returns a promise so we use await keyword to wait for the promise to resolve
    const validPassword = await bcrypt.compare(password, findUser.password); //compare the password with the hashed password
    if (validPassword) {                                                      //if password is valid  
      if (findUser.role === "user") {                                         //if user is a user
        // const token = genToken(findUser._id);
        res.json({                                                            //send this message to the frontend
          success: true,
          message: "successfully logged in",
          userDetails: findUser,
          role: "user",
        });
      }
      if (findUser.role === "admin") {                                        //if user is a admin
        res.json({                                                            //send this message to the frontend
          success: true,
          message: "successfully logged in",
          userDetails: findUser,
          role: "admin",
        });
      }
    } else if (!validPassword) {                                              //if password is invalid
      res.json({ success: false, invalidUser: "Invalid email or password" }); //send this message to the frontend
    }
  } catch (error) {
    //application will not crash if we catch errors,so please use try and catch blocks to avoid applications crashes
    console.log("error found in login fn()", error);
    res.json({ success: false, invalidUser: "Invalid email or password" });
  }
};


//*************************************************************************************************************************** */
//*************************************************************************************************************************** */
//*************************************************************************************************************************** */


// buy a Book
exports.buyBook = async (req, res) => {                       //buy book function
  try {
    const { userId, bookId, startTime, endTime } = req.body;  
    //req.body is an object that contains all the data that we send from the frontend

    const buyAbook = await UserModel.findByIdAndUpdate( 
    //findByIdAndUpdate is a mongoose method that returns a promise so we use await keyword to wait for the promise to resolve
      { _id: userId },                                           //find the user by id and update the user
      {
        $push: { books: [bookId] },                               //push the book id to the books array
        $addToSet: { leaseTime: { bookId, startTime, endTime } }, //add the book id and start time to the leaseTime array
      },
      { new: true }                                               //return the updated user object
    );
    if (buyAbook) {                                               //if book bought successfully
      res.json({
        success: true,                                          //send this message to the frontend
        message: "You bought this book success",
        data: buyAbook,
      });
    }
  } catch (error) {                                             //if error found
    console.log("Err in buyBook function()", error);              //log the error
    res.json({                                                    //send this message to the frontend
      success: false,
      message: "Err in buyBook function()",
    });
  }
};

//*************************************************************************************************************************** */
//*************************************************************************************************************************** */
//*************************************************************************************************************************** */

// update profile
exports.profileupdate = async (req, res) => {
  try {
    const { _id } = req.params;
    //findByIdAndUpdate is a mongoose method that returns a promise so we use await keyword to wait for the promise to resolve
    const profileUpdated = await UserModel.findByIdAndUpdate({ _id }, req.body); //find the user by id and update the user
    
    if (profileUpdated) {                                       //if profile updated successfully
      res.json({                                              //send this message to the frontend
        success: true,
        message: "Profile update successfully",
        data: profileUpdated,
      });
    }
  } catch (error) {                                           //if error found
    console.log("Err in profileupdate function()", error);    //log the error 
    res.json({                                                //send this message to the frontend
      success: false,
      message: "Err in profileupdate function()",
    });
  }
};

//*************************************************************************************************************************** */
//*************************************************************************************************************************** */
//*************************************************************************************************************************** */

// getProfileData
exports.getProfileData = async (req, res) => {
  try { 
    const { _id } = req.params;                   //req.params is an object that contains all the data that we send from the frontend
    //findById is a mongoose method that returns a promise so we use await keyword to wait for the promise to resolve
    const getProfile = await UserModel.findById({ _id });     //find the user by id
    if (getProfile) {                                         //if profile found successfully
      res.json({                                              //send this message to the frontend
        success: true,
        message: "Profile successfully",
        data: getProfile,
      });
    }
  } catch (error) {                                          //if error found
    console.log("Err in getProfileData function()", error); //log the error
    res.json({                                              //send this message to the frontend
      success: false,
    });
  }
};

// filterBooks
exports.filterBooks = async (req, res) => {
  try {
    const { filter, type } = req.query;     //req.query is an object that contains all the data that we send from the frontend
    //find is a mongoose method that returns a promise so we use await keyword to wait for the promise to resolve
    const getFilteredBooks = await BooksModel.find({ [type]: filter }); //find the book by type and filter
    if (getFilteredBooks) {                                             //if filtered books found successfully
      res.json({                                                      //send this message to the frontend
        success: true,
        message: "Results found successfully",
        data: getFilteredBooks,
      });
    }
  } catch (error) {                                                  //if error found
    console.log("Err in filterBooks function()", error);           //log the error
    res.json({                                                    //send this message to the frontend
      success: false,
      message: "Err in filterBooks function()",
    });
  }
};

//*************************************************************************************************************************** */
//*************************************************************************************************************************** */
//*************************************************************************************************************************** */

// filterBooks
exports.singleBook = async (req, res) => {
  try {
    const { _id } = req.params;    //req.params is an object that contains all the data that we send from the frontend through the parameter
    //findById is a mongoose method that returns a promise so we use await keyword to wait for the promise to resolve
    const singleBook = await BooksModel.findById({ _id }); //find the book by id
    if (singleBook) {                                    //if book found successfully
      res.json({                                        //send this message to the frontend
        success: true,
        message: "Results found successfully",
        data: singleBook,
      });
    }
  } catch (error) {                                   //if error found
    console.log("Err in singleBook function()", error); //log the error
    res.json({                                      //send this message to the frontend
      success: false,
      message: "Err in singleBook function()",
    });
  }
};

//*************************************************************************************************************************** */
//*************************************************************************************************************************** */
//*************************************************************************************************************************** */

// rateNow
exports.rateNow = async (req, res) => {
  try {
    const { _id, rating } = req.params;
    const singleBook = await BooksModel.findByIdAndUpdate(
      { _id },
      { rating },
      { new: true }
    );
    if (singleBook) {
      res.json({
        success: true,
        message: "Thanks for your ratings.",
        data: singleBook,
      });
    }
  } catch (error) {
    console.log("Err in rateNow function()", error);
    res.json({
      success: false,
      message: "Err in rateNow function()",
    });
  }
};

//*************************************************************************************************************************** */
//*************************************************************************************************************************** */
//*************************************************************************************************************************** */

// postComment

exports.postComment = async (req, res) => {
  try {
    const { _id } = req.params;   
    //req.params is an object that contains all the data that we send from the frontend through the parameter
    const { username, comment } = req.body; 
    //req.body is an object that contains all the data that we send from the frontend through the body
    
    const singleBook = await BooksModel.findByIdAndUpdate( //find the book by id and update the book
      { _id },                                              //find the book by id 
      { $addToSet: { comments: { username, comment } } },   //add the comment to the comments array
      { new: true }                                             //return the updated book
    );
    if (singleBook) {                                           //if book found successfully
      res.json({                                                //send this message to the frontend
        success: true,
        message: "Comment posted succesfully",
        data: singleBook,                                     //send the updated book to the frontend
      });
    }
  } catch (error) {                                               //if error found
    console.log("Err in postComment function()", error);              //log the error
    res.json({                                                  //send this message to the frontend
      success: false,
      message: "Err in postComment function()",
    });
  }
};

//*************************************************************************************************************************** */
//*************************************************************************************************************************** */
//*************************************************************************************************************************** */


// getcomments
exports.getcomments = async (req, res) => {
  try {
    const { _id } = req.params;                         
    //req.params is an object that contains all the data that we send from the frontend through the parameter
    const comments = await BooksModel.findById({ _id });        //find the book by id
    if (comments) {                                             //if book found successfully
      res.json({                                                //send this message to the frontend
        success: true,
        message: "Comment posted succesfully",
        data: comments,                                         //send the book data to the frontend
      });
    }
  } catch (error) {                                               //if error found
    console.log("Err in getcomments function()", error);              //log the error
    res.json({                                                  //send this message to the frontend
      success: false,
      message: "Err in getcomments function()",
    });
  }
};

//*************************************************************************************************************************** */
//*************************************************************************************************************************** */
//*************************************************************************************************************************** */

// getusers

exports.getusers = async (req, res) => {
  try {
    const users = await UserModel.find();     //find all the users
    if (users) {                              //if users found successfully
      res.json({                              //send this message to the frontend
        success: true,
        data: users,                              //send the users data to the frontend
      });
    }
  } catch (error) {                                     //if error found
    console.log("Err in getusers function()", error);             //log the error
    res.json({                                          //send this message to the frontend
      success: false,
      message: "Err in getusers function()",
    });
  }
};

//*************************************************************************************************************************** */
//*************************************************************************************************************************** */
//*************************************************************************************************************************** */

// deleteUser
exports.deleteUser = async (req, res) => {
  let { _id } = req.params; //req.params is an object that contains all the data that we send from the frontend through the parameter
  try {
    let data = await UserModel.findByIdAndDelete({ _id });  //find the user by id and delete the user
    if (data) {                                             //if user found successfully  
      res.json({ success: true, message: "User delete succesfully", data });  //send this message to the frontend
    }
  } catch (e) {                                             //if error found
    console.log("ERR", e);                                  //log the error
    res.json({                                               //send this message to the frontend
      success: false,
      message: "Internal server error",
    });
  }
};

//*************************************************************************************************************************** */
//*************************************************************************************************************************** */
//*************************************************************************************************************************** */

// getRentalDetails
exports.getRentalDetails = async (req, res) => {
  let listIds = req.body;   //req.body is an object that contains all the data that we send from the frontend through the body
  if (listIds.length === 0) {   //if listIds is empty
    res.json({                      //send this message to the frontend
      success: false,
      message: "No rental details were found!",
    });
    return;                     //return from the function
  }
  try {                         //if no error found
    let dataArr = [];            //create an array to store the data
    await Promise.all(          //await all the promises
      listIds.map(async (id) => {   //map the listIds array
        let data = await BooksModel.findById({ _id: id }); //find the book by id from the listIds array
        dataArr.push(data);                           //push the data to the dataArr array
      })
    );

    res.json({                                      //send this message to the frontend
      success: true,
      data: dataArr,                                //send the dataArr array to the frontend
    });
  } catch (e) {                                   //if error found
    console.log("ERR", e);                        //log the error
    res.json({                                    //send this message to the frontend
      success: false,
    });
  }
};


//*************************************************************************************************************************** */
//*************************************************************************************************************************** */
//*************************************************************************************************************************** */

// getRentalDetailsSingleUser
exports.getRentalDetailsSingleUser = async (req, res) => {
  let { _id } = req.params;                                             
  //req.params is an object that contains all the data that we send from the frontend through the parameter
  try {
    let data = await UserModel.findById({ _id }).populate("books");     //find the user by id and populate the books array
     if (data) {                        //if user found successfully
      res.json({                        //send this message to the frontend
        success: true,
        data: data.books,
      });
    }
  } catch (e) {                              //if error found
    console.log("ERR", e);                      //log the error
    res.json({                              //send this message to the frontend
      success: false,
    });
  }
};

//*************************************************************************************************************************** */
//*************************************************************************************************************************** */
//*************************************************************************************************************************** */
