const express = require("express");
const { create, index, getSingle, update } = require("../controllers/transaction.controller");

const transactionRouter = express.Router();

transactionRouter.route("/").post(create);
transactionRouter.route("/").get(index);
transactionRouter.route("/:id").get(getSingle);
transactionRouter.route("/update/:id").patch(update);
transactionRouter.route("/transfer-coins").post(create);

module.exports = transactionRouter;
