const { client } = require("../tcp_connection")

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