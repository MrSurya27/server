const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
    policyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Policy',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },

   
    claimDate: {
        type: Date,
        required: [true, "Claim date is required"]
    },
    claimAmount: {
        type: Number,
        required: [true, "Claim amount is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected' , 'Reimbursed'],
        default: 'Pending'
    },

    

}, { timestamps: true });

module.exports = mongoose.model('Claim', claimSchema);
