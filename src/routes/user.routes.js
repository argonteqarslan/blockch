const express = require("express");
const { create, index, getSingle, update, transferToChainCtrl, transferOffChain, signIn, getOffChainAndOnChainBalanceFromDb, topUpOffChainWithVoucher } = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.route("/").post(create);
userRouter.route("/signin").post(signIn);
userRouter.route("/").get(index);
userRouter.route("/:id").get(getSingle);
userRouter.route("/update/:id").patch(update);
userRouter.route("/transfer-to-chain").post(transferToChainCtrl);
userRouter.route("/transfer-off-chain").post(transferOffChain);
userRouter.route("/balance/:id").get(getOffChainAndOnChainBalanceFromDb);
userRouter.route("/top-up").post(topUpOffChainWithVoucher);

module.exports = userRouter;
