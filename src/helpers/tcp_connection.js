const net = require('net');
const client = new net.Socket();

exports.tcpConnection = () => {
    const Ip = "192.168.3.17"
    const Port = 37356;

    client.connect(Port, Ip, () => {
        console.log("connected to tcp server")
    })

    client.on('error', (err) => {
        console.log(err.message)
    })

    client.on('close', () => {
        console.log("connection closed")
    })
}

exports.client = client