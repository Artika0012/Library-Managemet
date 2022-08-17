const BooksModel = require("../Models/BooksModel");                          //import the schema of books

//******************************************************************************************************************************* */
//******************************************************************************************************************************* */
//******************************************************************************************************************************* */

// add books
exports.addBooks = async (req, res) => {                                    // add books function
  try {
    let recordSave = new BooksModel(req.body);                              //get all the data from the request body from the frontend                    
    let data = await recordSave.save();                                     //save the data in the database
    if (res) {                                                              //if data is saved then send the response
      res.json({ success: true, message: "Book added succesfully", data }); //send the response to the frontend
    }
  } catch (e) {                                                             //if error then send the error response to the frontend
    console.log("ERR", e);                                                  //log the error in the console
    res.json({ success: false, 
      message: "Error may due to empty any field or you must unique name of book.",
    });                                                                     //send the error response to the frontend
  }
};

//******************************************************************************************************************************* */
//******************************************************************************************************************************* */
//******************************************************************************************************************************* */

// get books
exports.getBooks = async (req, res) => {                                    // get books function
  try {
    let data = await BooksModel.find();                                     //find all the data in the database
    if (data) {                                                             //if data is found then send the response
      res.json({ success: true, message: "Book got succesfully", data });   
    }
  } catch (e) {                                                             //if error then send the error response to the frontend
    console.log("ERR", e);                                                  //log the error in the console    
    res.json({
      success: false,
      message: "Internal server error",
    });                                                                     //send the error response to the frontend
  }
};

//******************************************************************************************************************************* */
//******************************************************************************************************************************* */
//******************************************************************************************************************************* */

// deleteBook
exports.deleteBook = async (req, res) => {                                  // delete book function
  let { _id } = req.params;                                                 //get the id from the request body from the frontend
  try {
    let data = await BooksModel.findByIdAndDelete({ _id });                 //find the data in the database and delete the data
    if (data) {                                                             
      res.json({ success: true, message: "Book delete succesfully", data }); //send the response to the frontend
    }
  } catch (e) {                                                             //if error then send the error response to the frontend
    console.log("ERR", e);                                                  //log the error in the console  
    res.json({
      success: false,
      message: "Internal server error",
    });                                                                     //send the error response to the frontend
  }
};

//******************************************************************************************************************************* */
//******************************************************************************************************************************* */
//******************************************************************************************************************************* */