const User = require("../models/user.model");
const { client } = require("../tcp_connection")

exports.create = async (req, res) => {
  try {
    console.log("request :", req);
    const transaction = await User.create(req.body);
    const responseFromW3 = await blockChainHelper(req.body, transaction.id)
    console.log("Arslan", responseFromW3)
    console.log("user and transaction :", transaction);
    res.status(200).send({
      status: "success",
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
      data: transaction
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.getSingle = async (req, res) => {
  try {
    const transaction = await User.findOne({
      id: req.params.id,
    });
    console.log("array of  user and his transactions :", transaction);
    const responseFromW3 = await getBalanceHelper()
    console.log("Arslan", responseFromW3)

    res.status(200).send({
      status: "success",
      data: transaction,
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
      status: "Updated Successfully"
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

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
function convertToBuffer(data) {
  return Buffer.from(JSON.stringify(data))
}
function convertToJson(buffer) {
  return JSON.parse(buffer.toString())
}


async function getBalanceHelper() {
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
