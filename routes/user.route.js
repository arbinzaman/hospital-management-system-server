const express = require("express");
const userController = require("../controllers/user.controller");
const paginate = require("../middlewares/paginate");
const uploader = require("../middlewares/uploader");
const verifyAdmin = require("../middlewares/verifyAdmin");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

router.post("/login", userController.login);

router.post("/signup", verifyAdmin, userController.staffSignUp);

router.post("/update-password", verifyToken, userController.updatePass);

router.post("/upload-picture", verifyToken, uploader.imageUploader.single("image"), userController.updateProfilePicture);

router.get("/user-info", verifyToken, userController.getMe);

router.get("/all-doctors", verifyToken, paginate, userController.getAllDoctors)

router.get("/all-user", verifyAdmin, paginate, userController.getAllUsers);

router.route("/:userId")
    .get(verifyAdmin, userController.getUserById)
    .delete(verifyAdmin, userController.deleteUserById)

module.exports = router;