// Dependencies and Modules
const express = require("express");
const userController = require("../controllers/user");

// Import the auth module
const { verify, verifyAdmin } = require("../auth");

// Routing Component
const router = express.Router();

// Check Email Duplicate
router.post("/checkEmail", userController.checkDuplicateEmail);

// User registration route
router.post("/", userController.registerUser);

// User Authentication
router.post("/login", userController.loginUser);

// Retrieve User Details
router.get("/details", verify, userController.getProfile);

router.post(
  "/getUserDetails",
  verify,
  verifyAdmin,
  userController.getSpecificProfile
);

// Update User as Admin
router.put(
  "/:userId/set-as-admin",
  verify,
  verifyAdmin,
  userController.updateAdmin
);

// Reset the password route
router.put("/update-password", verify, userController.updatePassword);

// Export Route System
module.exports = router;
