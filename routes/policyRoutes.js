const express = require("express");

const {
    createPolicy, getAllPolicies, getPolicyById, updatePolicyById, deletePolicyById, assignPolicyToUser
, getAllUserPolicies} = require("../Controllers/policyController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();


router.route("/policy").post(isAuthenticatedUser, authorizeRoles("admin"), createPolicy);
router.route("/policies").get(isAuthenticatedUser, authorizeRoles("admin", "TPA"), getAllPolicies);
router.route("/user/policies").get(isAuthenticatedUser, getAllUserPolicies);

router.route("/policy/:id").get(isAuthenticatedUser,getPolicyById);
router.route("/policy/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updatePolicyById);
router.route("/policy/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deletePolicyById);
router.route("/assign-policy/:id").post(isAuthenticatedUser,authorizeRoles("admin"),assignPolicyToUser);

module.exports=router;