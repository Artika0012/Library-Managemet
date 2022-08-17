module.exports = asyncCatch = (argFun) => {           //create a function to catch the errors
  return (req, res, next) => {                        //return a function
    argFun(req, res).catch((err) => next(err));         //call the function and catch the error
  };
};
