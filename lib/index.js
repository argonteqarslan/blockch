'use strict'
var express = require('express');
const { transactionRoutes } = require('./routes/index.routes');
const { dbConnection } = require("./db")


dbConnection();

let app = express()
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use('/transactions', transactionRoutes);

app.get('/', (req, res) => {
  
  res.send("server is live")
})

let server = app.listen(3000, () => {
  console.log(`server running at port http://localhost/${server.address().port}`)
})
