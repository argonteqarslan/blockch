const net = require('net');
const client = new net.Socket();

exports.tcpConnection = () => {
    const Ip = "192.168.1.250"
    const Port = 6699;

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