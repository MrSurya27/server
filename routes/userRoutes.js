const express = require("express");
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updateUserPassword, updateUserProfile, getAllPolicyHolders, updateUserRole, isLoggedIn, getAllUsers } = require("../Controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();


router.route("/auth/register").post(registerUser);
router.route("/auth/login").post(loginUser);
router.route("/auth/logout").get(logout);
router.route("/auth/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/user").get(isAuthenticatedUser, getUserDetails);
router.route("/user/password").put(isAuthenticatedUser, updateUserPassword);
router.route("/user").put(isAuthenticatedUser, updateUserProfile);
router.route("/policy-holders").get(isAuthenticatedUser, authorizeRoles("admin"), getAllPolicyHolders);
router.route("/all-users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);

router.route("/change-role/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole);


module.exports = router;