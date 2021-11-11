const User = require("../models/user.model");
const { client } = require("../tcp_connection")

exports.create = async (req, res) => {
  try {
    console.log("request :", req);
    const transaction = await User.create(req.body);
    const responseFromW3 = await blockChainHelper(req.body, transaction.id);
    console.log("Arslan", responseFromW3);
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

exports.withDrawToChainCtrl = async (req, res) => {
  try {
    let {
      body
    } = req;
    await withdrawToChainHelper({ Address: body.walletAddress, Amount: body.amount, gasLimit: body.gasLimit });

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
    Recipient: "0xA44CEB136e3291f9d3Dd0682c6E07681F9AeA9aa"
  }
  client.write(convertToBuffer(getBalanceObject));
  client.on('data', async (ins) => {
    ins = convertToJson(ins)
    console.log(ins)
    let a = await User.updateOne({
      _id: id
    }, {
      amount: ins.Amount
    }, { upsert: true })
    return a
  })
  return true
}

async function transferBalance() {
  const getBalanceObject = {
    Name: "Balance_of",
    Recipient: "0xA44CEB136e3291f9d3Dd0682c6E07681F9AeA9aa"
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
    Recipient: "0xA44CEB136e3291f9d3Dd0682c6E07681F9AeA9aa"
  }
  client.write(convertToBuffer(getBalanceObject));
  client.on('data', async (ins) => {
    ins = convertToJson(ins)
    console.log(ins)
  })
}

async function withdrawToChainHelper({ Address, Amount, gasLimit }) {
  const withdrawToChainObject = {
    Name: "WithDraw_To_Chain",
    Address,
    Amount,
    gasLimit: gasLimit
  }
  client.write(convertToBuffer(withdrawToChainObject));
  client.on('data', async (ins) => {
    ins = convertToJson(ins)
    console.log(ins)
  })
  return true
}

async function changeOwner() {
}



function convertToBuffer(data) {
  return Buffer.from(JSON.stringify(data))
}
function convertToJson(buffer) {
  return JSON.parse(buffer.toString())
}