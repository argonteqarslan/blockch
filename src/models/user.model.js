const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userEmail: {
    type: String
  },
  userName: {
    type: String
  },
  password: {
    type: String
  },
  tokenHash: {
    type: String
  },
  blockChainAddress: {
    type: String
  },
  availibleCoins: {
    type: Number
  },
  withdrawlTransactions: [{}],
  amount: Number,
  offChainAmount: { type: Number, default: 0 },
  onChainAmount: Number,
  recipientAddress: String,
  time: String,
  isDeleted: Boolean,
  detail: String,
  walletAddress: String
}, {
  timestamps: true
})

const User = mongoose.model('User', UserSchema);

module.exports = User;