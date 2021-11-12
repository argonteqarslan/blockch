const express = require("express");
const { create, index, getSingle, update, transferToChainCtrl, transferOffChain } = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.route("/").post(create);
userRouter.route("/").get(index);
userRouter.route("/:id").get(getSingle);
userRouter.route("/update/:id").patch(update);
userRouter.route("/transfer-to-chain").post(transferToChainCtrl);
userRouter.route("/transfer-off-chain").post(transferOffChain);

module.exports = userRouter;
