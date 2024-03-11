const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const crypto = require("crypto");
const Policy = require("../models/policyModel.js");
const User = require("../models/userModel.js");

// Create Policy -- Admin

exports.createPolicy = catchAsyncErrors(async (req, res, next) => {
    const policy = await Policy.create(req.body);

    res.status(200).json({
        success: true,
        policy
    });
});

// Get all policies

exports.getAllUserPolicies = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    // Extract policy IDs from the user's policies
    const policyIds = user.policies.map(policyObj => policyObj._id);
    // Find all policies using the extracted policy IDs
    const policies = await Policy.find({ _id: { $in: policyIds } });


    res.status(200).json({
        success: true,
        policies
    });
});

exports.getAllPolicies = catchAsyncErrors(async (req, res, next) => {

    // Find all policies using the extracted policy IDs
    const policies = await Policy.find({ });


    res.status(200).json({
        success: true,
        policies
    });
});

// Get a single policy by ID

exports.getPolicyById = catchAsyncErrors(async (req, res, next) => {
    const policy = await Policy.findById(req.params.id);

    if (!policy) {
        return next(new ErrorHandler('Policy not found', 404));
    }

    res.status(200).json({
        success: true,
        policy
    });
});

// Update a policy by ID -- Admin

exports.updatePolicyById = catchAsyncErrors(async (req, res, next) => {
    const policy = await Policy.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true 
    });

    if (!policy) {
        return next(new ErrorHandler('Policy not found', 404));
    }

    res.status(200).json({
        success: true,
        policy
    });
});

// Delete a policy by ID -- Admin

exports.deletePolicyById = catchAsyncErrors(async (req, res, next) => {
    const policy = await Policy.findByIdAndDelete(req.params.id);

    if (!policy) {
        return next(new ErrorHandler('Policy not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Policy deleted successfully'
    });
});

exports.assignPolicyToUser = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;
    const policyId = req.params.id;

    let user = await User.findOne({ email });
    const policy = await Policy.findById(policyId);

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    if (!policy) {
        return next(new ErrorHandler('Policy not found', 404));
    }

    if (user.policies.some(policy => policy._id.toString() === policyId)) {
        return next(new ErrorHandler('User already has this policy', 400));
    }

    if (!user.policies) {
        user.policies = [];
    }

    const { sumAssured } = policy;

    user.policies.push({ _id: policy._id, leftAmount: sumAssured });

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: 'Policy assigned to user successfully',
        user
    });
});

