const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const crypto = require("crypto");
const Policy = require("../models/policyModel.js");
const User = require("../models/userModel.js");
const Claim = require("../models/claimModel.js");

// Create a new claim
exports.createClaim = catchAsyncErrors(async (req, res, next) => {
    const { claimDate, claimAmount, description } = req.body;
    const policyId = req.params.id;
    const userId = req.user.id;

    if (!policyId || !userId || !claimDate || !claimAmount || !description) {
        return next(new ErrorHandler('Please provide all required fields', 400));
    }

    const user = await User.findById(userId);

    let foundPolicy = null;
    for (const policy of user.policies) {
        if (policy._id.toString() === policyId.toString()) {
            //console.log("hhdscbdjkfvnzdfm")
            foundPolicy = policy;
            break;
        }
    }

    if (!foundPolicy) {
        return next(new ErrorHandler('Policy not found', 404));
    }
    
    if (foundPolicy.leftAmount < claimAmount) {
        return next(new ErrorHandler("Claim can't be created because the claim amount is higher than the sum assured left", 400));
    }

    const claim = await Claim.create({
        userId,
        policyId,
        claimantName: req.user.name,
        claimDate,
        claimAmount,
        description,
    });

    res.status(200).json({
        success: true,
        claim
    });
});


// Get all claims of user by its id
exports.getLoggedInUserClaims = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user.id;
    const claims = await Claim.find({userId:userId});

    res.status(200).json({
        success: true,
        claims
    });
});

exports.getUserClaim = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user.id;
    const claims = await Claim.find({ userId: userId });

    res.status(200).json({
        success: true,
        claims
    });
});

exports.getUserClaimById = catchAsyncErrors( async (req,res,next)=> {
    const claimId = req.params.id;
    const claim = await Claim.findById(claimId);

    if (!claim) {
        return next(new ErrorHandler('Claim not found', 404));
    }

    res.status(200).json({
        success: true,
        claim
    });


})


// Get all claims of 
exports.getAllClaims = catchAsyncErrors(async (req, res, next) => {
    const claims = await Claim.find({});
    res.status(200).json({
        success: true,
        claims
    });
});
// Get a single claim by ID 
exports.getClaimById = catchAsyncErrors(async (req, res, next) => {
    const claim = await Claim.findById(req.params.id);
    const policy = await Policy.findById(claim.policyId);


    if (!claim) {
        return next(new ErrorHandler('Claim not found', 404));
    }

    res.status(200).json({
        success: true,
        claim,
        lastPaymentDate:policy.lastPaymentDate
    });
});

// Update a claim by ID
exports.updateClaimById = catchAsyncErrors(async (req, res, next) => {
    const claim = await Claim.findByIdAndUpdate(req.params.id, req.body, {
        new: true, 
        runValidators: true 
    });

    if (!claim) {
        return next(new ErrorHandler('Claim not found', 404));
    }

    res.status(200).json({
        success: true,
        claim
    });
});

// Delete a claim by ID
exports.deleteClaimById = catchAsyncErrors(async (req, res, next) => {
    const claim = await Claim.findByIdAndDelete(req.params.id);

    if (!claim) {
        return next(new ErrorHandler('Claim not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Claim deleted successfully'
    });
});

// Update the status of a claim by ID
exports.updateClaimStatusById = catchAsyncErrors(async (req, res, next) => {
    const { status } = req.body;

    const claim = await Claim.findByIdAndUpdate(req.params.id, { status }, {
        new: true, 
        runValidators: true 
    });

    if (!claim) {
        return next(new ErrorHandler('Claim not found', 404));
    }

    res.status(200).json({
        success: true,
        claim
    });
});
