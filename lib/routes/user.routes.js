const express = require("express");
const { create, index, getSingle, update,withDrawToChainCtrl } = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.route("/").post(create);
userRouter.route("/").get(index);
userRouter.route("/:id").get(getSingle);
userRouter.route("/update/:id").patch(update);
userRouter.route("/withdraw-to-chain").post(withDrawToChainCtrl);

module.exports = userRouter;
