const mongoose = require("mongoose"); //This is database schema for Books
const BookSchema = mongoose.Schema(   //mongodb schema for Books
  {
    title: {                                      //title of the book
      type: String,                                 //type of the field
      unique: true,                                 //unique field
      trim: true,                                   //trim the field
      lowercase: true,                              //lowercase the field
  
    },
    author: {                                   //author of the book
      type: String,
      required: true,
    },
    category: {                               //category of the book
      type: String,
      required: true,
    },
    publication: {                            //publication of the book
      type: String,
      required: true,
    },
    image: {                                  //image of the book
      type: String,
      required: true,
    },
    comments: {                             //comments of the book
      type: [Object],
    },
    rating: {                                   //rating of the book
      type: String,
    },
  },
  { strict: false }                           //strict false for the schema
);
module.exports = mongoose.model("Book", BookSchema);          
//export the schema for the database - "Book" is the name of the collection in the database
