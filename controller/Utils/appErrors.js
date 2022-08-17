class appError extends Error {          ///create a class for the error which extends the error class
  constructor(message, statusCode) {    ///constructor for the class
    super(message);                     ///call the super class constructor
    this.status = "failed"              ///set the status of the error
    this.statusCode = statusCode;       ///set the status code of the error
    this.isOpertional = true;           ///set the operational status of the error
    //we have all the stack error inside the Error.stack
    // Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = appError;          ///export the class for the error
