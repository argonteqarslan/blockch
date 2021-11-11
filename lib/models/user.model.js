const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
  transactions: [{}],
  amount: Number,
  recipientAddress: String,
  time: String,
  isDeleted: Boolean,
  detail: String
}, {
  timestamps: true
})

const User = mongoose.model('User', UserSchema);

module.exports = User;