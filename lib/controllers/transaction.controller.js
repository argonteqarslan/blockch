const Transaction = require("../models/transaction.model");
const net = require('net');
const client = new net.Socket();


exports.create = async (req, res) => {
  try {
    console.log("request :", req);
    const transaction = await Transaction.create(req.body);
    const responseFromW3 = await blockChainHelper(req.body)
    console.log("Arslan",responseFromW3)
    console.log("user and transaction :", transaction);
    res.status(200).send({
      status: "success",
      data: transaction
    });
  } catch (err) {
    res.status(500).send({ message: error.message });
  }
}

exports.index = async (req, res) => {
  try {
    const transaction = await Transaction.find({});
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
    const transaction = await Transaction.findOne({
      id: req.params.id,
    });
    console.log("array of  user and his transactions :", transaction);

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
    console.log(req.params.id)
    await Transaction.updateOne({
      _id: req.params.id
    }, body, { upsert: true })

    res.status(200).send({
      status: "Updated Successfully"
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

async function blockChainHelper(data) {
  const Ip = "192.168.3.17"
  const Port = 37356;

  client.connect(Port, Ip, () => {
    console.log("connected")
  })

  let a = client.on('data', (ins) => {
    ins = convertToJson(ins)
    console.log(ins)
})


  client.on('error', (err) => {
    console.log(err.message)
  })

  client.on('close', () => {
    console.log("connection closed")
  })


  function convertToBuffer(data) {
    return Buffer.from(JSON.stringify(data))
  }

  const dataObject = {
    Name: data.userName
  }

  let write = client.write(convertToBuffer(dataObject))

  function convertToJson(buffer) {
    return JSON.parse(buffer.toString())
  }
  return data;
}
