const {
  signupService,
  findAllUserService,
  findUserByEmailService,
  getUserInfoService,
  getAllDoctorsService,
  getUserByIdService,
  updatePassService,
  updateImageUrlService,
  deleteUserByIdService } = require("../services/user.service");
const { generateToken } = require("../utils/token");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        status: "fail",
        error: "Please provide your credentials",
      });
    }

    const user = await findUserByEmailService(email)

    if (!user) {
      return res.status(401).json({
        status: "fail",
        error: "No user found. Please create an account",
      });
    }

    const isPasswordValid = user.comparePassword(password, user.password);


    if (!isPasswordValid) {
      return res.status(403).json({
        status: "fail",
        error: "Password is not correct",
      });
    }

    const token = generateToken(user);

    const { password: pwd, ...others } = user.toObject()

    res.status(200).json({
      status: "success",
      message: "Successfully logged in",
      data: {
        data: others,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {

    const url = await updateImageUrlService(req)

    res.status(200).json({
      status: "success",
      message: "Profile Picture Updated Sucessfully",
      url
    })
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message
    })
  }
}

exports.updatePass = async (req, res) => {
  try {

    const { password, newPassword } = req.body

    if (!newPassword || !password) {
      return res.status(401).json({
        status: "fail",
        error: "Please provide required credentials",
      });
    }

    const { email } = req.user;

    const user = await findUserByEmailService(email)

    if (!user) {
      return res.status(401).json({
        status: "fail",
        error: "No user found. Please create an account",
      });
    }

    const isPasswordValid = user.comparePassword(password, user.password);


    if (!isPasswordValid) {
      return res.status(403).json({
        status: "fail",
        error: "Password is not correct",
      });
    }

    const updatesPass = user.updatePass(newPassword)

    await updatePassService(updatesPass, user._id)

    res.status(200).json({
      status: 'success',
      message: "Password Updated Successfully"
    })

  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
}

exports.getMe = async (req, res) => {
  try {
    const user = await getUserInfoService(req.user?.email);

    const { password, ...others } = user.toObject()

    res.status(200).json({
      status: "success",
      data: others,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {

    if (!req?.admin) {
      return res.status(403).json({
        status: "fail",
        message: "You cannot access this data",
      });
    }

    const { users, total } = await findAllUserService(req.pagination);

    const { page } = req.pagination;

    res.status(200).json({
      status: "success",
      data: users,
      page,
      total,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {

    if (!req?.admin) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have access to this data.",
      });
    }

    const { userId } = req.params

    const user = await getUserByIdService(userId)

    res.status(200).json({
      status: "success",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
}

exports.staffSignUp = async (req, res) => {
  try {

    if (!req?.admin) {
      return res.status(403).json({
        status: "fail",
        message: "You cannot create accout for a " + req.body.role,
      });
    }

    const user = await signupService({ ...req.body, addedBy: req.adminId });

    await user.save();

    res.status(200).json({
      status: "success",
      message: req.body.role + " signup successfull"
    })

  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
}

exports.getAllDoctors = async (req, res) => {
  try {

    const { doctors, total } = await getAllDoctorsService(req.pagination)

    const { page } = req.pagination;

    res.status(200).json({
      status: "success",
      data: doctors,
      total, page,
    })

  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
}

exports.deleteUserById = async (req, res) => {
  try {

    if (!req?.admin) {
      return res.status(403).json({
        status: "fail",
        message: "You cannot delete this user",
      });
    }

    const { userId } = req.params

    const data = await deleteUserByIdService(userId)

    if (!data.deletedCount) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
}

// exports.confirmEmail = async (req, res) => {
//   try {
//     const { token } = req.params;


//     const user = await findUserByToken(token);

//     if(!user){
//       return res.status(403).json({
//         status: "fail",
//         error: "Invalid token"
//       });
//     }

//     const expired = new Date() > new Date(user.confirmationTokenExpires);

//     if(expired){
//       return res.status(401).json({
//         status: "fail",
//         error: "Token expired"
//       });
//     }

//     user.status = "active";
//     user.confirmationToken = undefined;
//     user.confirmationTokenExpires = undefined;

//     user.save({ validateBeforeSave: false });

//     res.status(200).json({
//       status: "success",
//       message: "Successfully activated your account.",
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "fail",
//       error,
//     });
//   }
// };