const express = require("express");

const { USER } = require("../utils/constants");

// Middlewares
const { protect, allowedTo } = require("../middleware/auth.middleware");
const FirebaseController = require("../controllers/firebase.controller");
const upload = require("../middleware/upload.middleware");
// Classes
const UserAuthController = require("../controllers/userAuth.controller");
const UserValidator = require("../validators/user.validator");
const GlobalValidator = require("../validators/global.validator");

// Router
const router = express.Router();

// Auth Routes
router.route("/register").post(
  upload.uploadAnyImages,
  FirebaseController.uploadMultipleImagesForTheUser("Users"),
  UserValidator.validateRegisterUser,
  UserAuthController.userRegister
);

router.route("/login").post(GlobalValidator.validateLogin, UserAuthController.userLogin);

router.route("/verify-account").post(UserAuthController.userVerifyAccount);

router.patch(
  "/change-password",
  protect,
  allowedTo(USER),
  GlobalValidator.validateChangePassword,
  UserAuthController.updateLoggedUserPassword
);

router.post("/verify-otp", UserAuthController.verifyOtp);
router.post("/send-otp", GlobalValidator.sendOtpValidator, UserAuthController.sendOtp);
router.post("/log-out", protect, allowedTo(USER), UserAuthController.logOut);

module.exports = router;
