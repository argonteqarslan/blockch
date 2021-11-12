const User = require("../models/user.model");
const { client } = require("../helpers/tcp_connection")

exports.create = async (req, res) => {
  try {
    console.log("request :", req);
    const transaction = await User.create(req.body);

    const responseFromW3 = await blockChainHelper(req.body, transaction.id);
    console.log("res", responseFromW3);
    console.log("user and transaction :", transaction);

    res.status(200).send({
      status: "success",
      message: "your account has been registered successfully",
      data: transaction
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.index = async (req, res) => {
  try {
    const transaction = await User.find({});
    console.log("array of all user and transactions :", transaction);

    res.status(200).send({
      status: "success",
      message: "success",
      data: transaction
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getSingle = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
    });
    console.log("res of single user and his transactions :", user);
    const responseFromW3 = await getBalanceHelper(req.params.id);
    console.log("Arslan", responseFromW3);

    res.status(200).send({
      status: "success",
      message: "success",
      data: user,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    let {
      body
    } = req;
    await User.updateOne({
      _id: req.params.id
    }, body, { upsert: true })

    res.status(200).send({
      status: "information updated successfully",
      message: "success",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.transferToChainCtrl = async (req, res) => {
  try {
    let {
      body: {
        id,
        amount: amountToTransfer
      }
    } = req;

    const user = await User.findOne({
      _id: id,
    });

    if (user.offChainAmount && user.offChainAmount < amountToTransfer) {
      throw new Error('Insufficent amount.')
    }
    const remainingAmountAfterTransfer = user.offChainAmount - amountToTransfer
    await transferToChainHelper({ Address: body.walletAddress, Amount: amountToTransfer, gasLimit: body.gasLimit, user, remainingAmountAfterTransfer });

    res.status(200).send({
      status: "success",
      message: "success",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.transferOffChain = async (req, res) => {
  let {
    body: {
      id,
      offChainAmount
    }
  } = req;
  try {
    const user = await User.findOne({
      _id: id,
    });
    const amountAfterAddition = user.offChainAmount + parseInt(offChainAmount)
    await User.updateOne({
      _id: id
    }, {
      offChainAmount: amountAfterAddition
    }, { upsert: true })

    res.status(200).send({
      status: "success",
      message: "success",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

async function blockChainHelper(data, id) {
  client.on('data', async (ins) => {
    ins = convertToJson(ins)
    console.log(ins)
    let a = await User.updateOne({
      _id: id
    }, {
      detail: ins.detail
    }, { upsert: true })
    return a
  })

  const dataObject = {
    Name: "Test"
  }
  client.write(convertToBuffer(dataObject))
  return true;
}

async function getBalanceHelper(id) {
  const getBalanceObject = {
    Name: "Balance_of",
    Recipient: "0x5313d87af949395728Cc2BBd37eD8a6cBFc63b95"
  }
  client.write(convertToBuffer(getBalanceObject));
  client.on('data', async (ins) => {
    ins = convertToJson(ins)
    console.log(ins)
    let a = await User.updateOne({
      _id: id
    }, {
      onChainAmount: ins.Amount
    }, { upsert: true })
    return a
  })
  return true
}

async function transferBalance() {
  const getBalanceObject = {
    Name: "Balance_of",
    Recipient: "0x5313d87af949395728Cc2BBd37eD8a6cBFc63b95"
  }
  client.write(convertToBuffer(getBalanceObject));
  client.on('data', async (ins) => {
    ins = convertToJson(ins)
    console.log(ins)
  })
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
    gasLimit: gasLimit
  }
  client.write(convertToBuffer(transferToChainObject));
  client.on('data', async (ins) => {
    ins = convertToJson(ins)
    console.log(ins)
    if (ins.Res && ins.Res == 'Completed') {
      await User.updateOne({
        _id: user.id
      }, {
        offChainAmount: remainingAmountAfterTransfer
      }, { upsert: true })
    }
  })
  return true
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