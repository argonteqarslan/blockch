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
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res
    .status(err.status || 400)
    .send({ status: "error", message: err.message, data: {} });
  // res.json({ status: err.status || 500, message: err.message });
});