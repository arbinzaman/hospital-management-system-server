const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { findUserByEmailService } = require("../services/user.service");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")?.[1];

    if(!token){
      return res.status(401).json({
        status: "fail",
        error: "You are not logged in"
      });
    }
    

    const {role, email} = await promisify(jwt.verify)(token, process.env.TOKEN_SECRET);

    const {_id} = await findUserByEmailService(email)

    if(role === 'admin' || role === 'super-admin'){
        req.admin = true,
        req.adminId = _id
    }

    next();


  } catch (error) {
    res.status(403).json({
      status: "fail",
      error: "Invalid token"
    });
  }
};