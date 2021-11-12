const net = require('net');
const client = new net.Socket();

const Ip = "192.168.1.250"
const Port = 6699


client.connect(Port, Ip, () => {
    console.log("connected")
})

client.on('data', (data) => {
    data = convertToJson(data)
    console.log(data)
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

const data = {
    Name: "Test"
}

client.write(convertToBuffer(data))

function convertToJson(buffer) {
    return JSON.parse(buffer.toString())
}
