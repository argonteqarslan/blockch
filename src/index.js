'use strict'
var express = require('express');
const { userRoutes } = require('./routes/index.routes');
const { dbConnection } = require("./helpers/db")
const { tcpConnection } = require("./helpers/tcp_connection")

dbConnection();
tcpConnection();

let app = express()
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send("server is live")
})

let server = app.listen(3000, () => {
  console.log(`server running at port http://localhost/${server.address().port}`)
})
