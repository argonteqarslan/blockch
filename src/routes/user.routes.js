const express = require("express");
const {
  create,
  index,
  getSingle,
  update,
  transferToChainCtrl,
  transferOffChain,
  signIn,
  getOffChainAndOnChainBalanceFromDb,
  topUpOffChainWithVoucher,
  confirmPassword,
} = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.route("/").post(create);
userRouter.route("/signin").post(signIn);
userRouter.route("/").get(index);
userRouter.route("/:id").get(getSingle);
userRouter.route("/update/:id").post(update);
userRouter.route("/transfer-to-chain").post(transferToChainCtrl);
userRouter.route("/transfer-off-chain").post(transferOffChain);
userRouter.route("/balance/:id").get(getOffChainAndOnChainBalanceFromDb);
userRouter.route("/top-up").post(topUpOffChainWithVoucher);
userRouter.route("/confirm-password").post(confirmPassword);

module.exports = userRouter;
