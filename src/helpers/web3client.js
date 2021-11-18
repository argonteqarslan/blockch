const { client } = require("./tcp_connection")
const User = require("../models/user.model");

async function blockChainHelper(data, id) {
  const dataObject = {
    Name: "Test"
  }
  client.write(convertToBuffer(dataObject))
  const p = await new Promise((resolve) => {
    client.on('data', async (ins) => {
      ins = convertToJson(ins)
      console.log(ins)
      let a = await User.updateOne({
        _id: id
      }, {
        detail: ins.detail
      }, { upsert: true })
      resolve(ins)
    })
  });
  return p;
}

// client.on('data', ((args) => {
//   ins = convertToJson(args);
//   console.log(ins);
//   }));

async function getBalanceHelper(id) {
  const getBalanceObject = {
    Name: "Balance_of",
    Recipient: "0x5313d87af949395728Cc2BBd37eD8a6cBFc63b95"
  }
  client.write(convertToBuffer(getBalanceObject));
  console.log(client)
  const p = await new Promise((resolve) => {
    client.on('data', async (ins) => {
      ins = convertToJson(ins)
      console.log(ins)
      let a = await User.updateOne({
        _id: id
      }, {
        onChainAmount: ins.Amount
      }, { upsert: true })
      resolve(ins)
    })
  });
  return p
}

async function transferBalance() {
  const getBalanceObject = {
    Name: "Balance_of",
    Recipient: "0x5313d87af949395728Cc2BBd37eD8a6cBFc63b95"
  }
  client.write(convertToBuffer(getBalanceObject));
  const p = await new Promise((resolve) => {
    client.on('data', async (ins) => {
      ins = convertToJson(ins)
      console.log(ins)
    })
    resolve(ins)
  });
  return p
}

async function depositArgonToken() {
  const getBalanceObject = {
    Name: "Deposit_Token",
    Recipient: "0x5313d87af949395728Cc2BBd37eD8a6cBFc63b95"
  }
  client.write(convertToBuffer(getBalanceObject));
  client.on('data', async (ins) => {
    ins = convertToJson(ins)
    console.log(ins)
  })
}

async function transferToChainHelper({ Address, Amount, gasLimit, user, remainingAmountAfterTransfer }) {
  const transferToChainObject = {
    Name: "Transfer_To_Chain",
    Address,
    Amount,
    gasLimit: parseInt(gasLimit)
  }
  client.write(convertToBuffer(transferToChainObject));
  const p = await new Promise((resolve) => {
    client.on('data', async (ins) => {
      ins = convertToJson(ins)
      console.log(ins)
      if (ins.Res && ins.Res == 'Completed') {
        await User.updateOne({
          _id: user.id
        }, {
          offChainAmount: remainingAmountAfterTransfer
        }, { upsert: true })
      } else {
        throw new Error('Sorry could not transfer the coins.')
      }
      resolve(ins)
    })
  });
  return p
}

async function topUpOffChainWithVoucherHelper({
  walletAddress, Txid
}) {
  const topUpOffChainWithVoucherObject = {
    Name: "verifyRecipts",
    walletAddress,
    Txid
  }
  client.write(convertToBuffer(topUpOffChainWithVoucherObject));
  const p = await new Promise((resolve) => {
    client.on('data', async (ins) => {
      ins = convertToJson(ins)
      console.log(ins)
      resolve(ins)
    })
  });
  return p
}

function convertToBuffer(data) {
  return Buffer.from(JSON.stringify(data))
}
function convertToJson(buffer) {
  return JSON.parse(buffer.toString())
}


async function updateUserBalanceInOffChainTransfer(id, amountToTransfer) {
  const user = await User.findOne({
    _id: id,
  });

  if (user.offChainAmount && user.offChainAmount < amountToTransfer) {
    throw new Error('Insufficent amount.')
  }
  const remainingAmountAfterTransfer = user.offChainAmount - amountToTransfer;
  const updateUserBalance = await User.updateOne({
    _id: id
  }, {
    offChainAmount: remainingAmountAfterTransfer
  }, { upsert: true })
  return updateUserBalance
}

async function updateRecipientBalanceInOffChainTransfer(recipientId, amountToTransfer) {

  const recipient = await User.findOne({
    _id: recipientId,
  });
  const recipientAmountAfterTransfer = recipient.offChainAmount + amountToTransfer;

  const updateRecipientBalance = await User.updateOne({
    _id: id
  }, {
    offChainAmount: recipientAmountAfterTransfer
  }, { upsert: true })
  return updateRecipientBalance
}

module.exports = {
  blockChainHelper,
  getBalanceHelper,
  transferBalance,
  depositArgonToken,
  transferToChainHelper,
  updateUserBalanceInOffChainTransfer,
  updateRecipientBalanceInOffChainTransfer,
  topUpOffChainWithVoucherHelper
}