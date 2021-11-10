const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
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
  isDeleted: Boolean
}, {
  timestamps: true
})

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;