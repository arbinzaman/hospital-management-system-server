const User = require("../models/User");
const fs = require('fs');
const path = require('path');

exports.signupService = async (userInfo) => {
  return await User.create(userInfo)
};

exports.findUserByEmailService = async (email) => {
  return await User.findOne({ email }, { userAdded: 0, patientAdded: 0 });
};

exports.updateImageUrlService = async (req) => {

  const user = await User.findOne({ email: req.user.email });


  if (user.imageURL) {

    const previousImagePath = path.join(__dirname, '..', user.imageURL.replace(`${req.protocol}://${req.get('host')}/`, ''));
    fs.unlink(previousImagePath, (err) => {
      if (err) {
        return err;
      }
    });
  }

  const url = `${req.protocol}://${req.get('host')}/${req.file.path}`

  await User.updateOne({ _id: user._id }, { $set: { imageURL: url } })

  return user.imageURL
}

exports.getAllDoctorsService = async (pagination) => {

  let { startIndex, limit, key, value } = pagination;

  const query = { role: "doctor" };

  if (key && value) {
    query[key] = {
      $regex: value,
      $options: 'i'
    };
  }

  const total = await User.countDocuments(query);

  const doctors = await User.find(query).select("firstName lastName email phone status serialId")
    .sort({ serialId: -1 }).skip(startIndex).limit(limit);

  return { total, doctors };
};


exports.getUserInfoService = async (email) => {
  return await User.findOne({ email })
};

exports.updatePassService = async (password, _id) => {
  return await User.updateOne({ _id }, { password })
}

exports.findAllUserService = async (pagination) => {

  let { startIndex, limit, key, value } = pagination

  const query = key ? {
    [key]: {
      $regex: value,
      $options: 'i'
    }
  } : {};

  const total = await User.find(query).countDocuments()

  const users = await User.find(query).select("firstName lastName role email phone status serialId").sort({ serialId: -1 })
    .skip(startIndex).limit(limit);

  return { users, total }
}

exports.getUserByIdService = async (_id) => {
  return await User.findById(_id, { password: 0 }).populate('addedBy', 'firstName lastName role email')
}

exports.deleteUserByIdService = async (_id) => {
  return await User.deleteOne({ _id })
}