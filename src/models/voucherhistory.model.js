const mongoose = require('mongoose');

const VoucherHistorySchema = new mongoose.Schema({
    txId: {
        type: String
    },
    amount: Number,
    userId: String,
    walletAddress: {
        type: String
    },
    isRedeemed: {
        type: Boolean,
        default: true
    }
});

const VoucherHistory = mongoose.model('VoucherHistory', VoucherHistorySchema);

module.exports = VoucherHistory;