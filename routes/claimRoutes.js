const express = require("express");
const { createClaim, getAllClaims, updateClaimStatusById, getLoggedInUserClaims, getUserClaimById, getClaimById, updateClaimById, deleteClaimById } = require("../Controllers/claimController");
const { isAuthenticatedUser, checkUserPolicyOwnership, authorizeRoles, checkUserClaimOwnership, } = require("../middleware/auth"); // Corrected middleware import

const router = express.Router();

router.route("/claims/:id").post(isAuthenticatedUser, checkUserPolicyOwnership, createClaim);
router.route("/claims/:id").get(isAuthenticatedUser, checkUserClaimOwnership, getUserClaimById).put(isAuthenticatedUser, checkUserClaimOwnership, updateClaimById).delete(isAuthenticatedUser, checkUserClaimOwnership, deleteClaimById);

router.route("/claims").get(isAuthenticatedUser, getLoggedInUserClaims);
router.route("/TPA/claims").get(isAuthenticatedUser, authorizeRoles("TPA","admin"), getAllClaims);
router.route("/TPA/claims/:id").get(isAuthenticatedUser, authorizeRoles("TPA","admin"), getClaimById);

router.route("/TPA/claims/:id").put(isAuthenticatedUser, authorizeRoles("TPA", "admin"), updateClaimStatusById);


module.exports = router;
