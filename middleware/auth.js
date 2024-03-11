const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors")
const jwt = require("jsonwebtoken");
const Claim = require("../models/claimModel")

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    
    const token = req.cookies.token;
    
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);
    
    next();

})

exports.authorizeRoles = (...roles) => {
    
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role : ${req.user.role} is not allowed to access this resource`));
        }
        
        next();
    }


}

exports.checkUserPolicyOwnership = catchAsyncErrors( async (req,res,next) => {
    const  policyId  = req.params.id;
    const userId = req.user.id; 
    
    const user = await User.findById(userId).populate('policies');
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }


    if (user.policies._id == policyId) {
        console.log(user.policies._id, policyId);
    }
    const hasPolicy = user.policies.some(policy => policy._id == policyId);
    if (!hasPolicy) {
        return next(new ErrorHandler('User does not own this policy', 403));
    }

    next();

})

exports.checkUserClaimOwnership = catchAsyncErrors(async (req, res, next) => {
    const claimId = req.params.id;
    const userId = req.user.id;

    const claim = await Claim.findById(claimId);
    if (!claim) {
        return next(new ErrorHandler('Claim not found', 404));
    }


   
    if (claim.userId != userId) {
        return next(new ErrorHandler("You are not authorized to access this claim", 401));
   }

    next();

})