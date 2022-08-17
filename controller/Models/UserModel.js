const mongoose = require("mongoose"); //This is database schema for User
const Schema = mongoose.Schema; //mongodb schema for User

const user = new Schema({     //mongodb schema for User

  name: {                       //name of the user
    type: String,
  },
  image: {                      //image of the user
    type: String,
  },

  email: {                     //email of the user
    type: String,
    default: "",
  },

  about: {                    //about of the user
    type: String,
    default: "",
  },
  phone: {                    //phone of the user
    type: String,
    default: "",
  },
  age: {                      //age of the user
    type: String,
    default: "",
  },
  height: {                     //height of the user
    type: String,
    default: "",
  },
  weight: {                     //weight of the user
    type: String,
    default: "",
  },

  password: {                   //password of the user
    type: String,
  },
  role: {                       //role of the user
    type: String,
    enum: ["admin", "user"],    //enum for the role
    default: "user",
  },
  leaseTime: {                          //lease time of the user
    //see where it will be fit on
    type: [Object],                     //type of the field
    required: true,
  },
  books: [{ type: Schema.Types.ObjectId, ref: "Book" }], 
  //only purpose save buy books ids by the user, then we can populate books that were bought by the user
});

module.exports = mongoose.model("User", user);  
//export the schema for the database - "User" is the name of the collection in the database
