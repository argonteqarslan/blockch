const User = require("../models/user.model");
const VoucherHistory = require("../models/voucherhistory.model");
const { client } = require("../helpers/tcp_connection");
const {
  blockChainHelper,
  getBalanceHelper,
  transferToChainHelper,
  topUpOffChainWithVoucherHelper,
} = require("../helpers/web3client");
const _ = require("lodash");

exports.create = async (req, res, next) => {
  try {
    console.log("request :", req);
    const user = await User.findOne({
      userEmail: req.body.userEmail,
    });
    if (user) {
      throw new Error("user already exists.");
    }
    if (!req.body.password) {
      throw new Error("please enter  password.");
    }
    const transaction = await User.create(req.body);
    const responseFromW3 = await blockChainHelper(req.body, transaction.id);
    console.log("res", responseFromW3);
    console.log("user and transaction :", transaction);

    res.status(200).send({
      status: "success",
      message: "your account has been registered successfully",
      data: transaction,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: err.message,
      data: {},
    });
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const {
      body: { userEmail, password },
    } = req;
    const user = await User.findOne({
      userEmail,
    });
    if (!user) {
      throw new Error("user does not exists.");
    }
    if (user.password !== password) {
      throw new Error("invalid username /password.");
    } else {
      res.status(200).send({
        status: "success",
        message: "your have signed in successfully",
        data: user,
      });
    }
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: err.message,
      data: {},
    });
  }
};
exports.index = async (req, res, next) => {
  try {
    const users = await User.find({});
    console.log("array of all the users and transactions :", users);

    res.status(200).send({
      status: "success",
      message: "list of all the users",
      data: users,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
      data: {},
    });
  }
};

exports.getSingle = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
    });
    if (!user) {
      throw new Error("user does not exists.");
    }
    console.log("res of single user and his transactions :", user);
    const responseFromW3 = await getBalanceHelper(req.params.id);
    console.log("res from web 3 :", responseFromW3);
    res.status(200).send({
      status: "success",
      message: "success",
      data: user,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
      data: {},
    });
  }
};

exports.update = async (req, res, next) => {
  try {
    let {
      body,
      body: { password },
    } = req;
    // if (!password) {
    //   throw new Error('please provide a valid password.')
    // }
    const user = await User.findOne({
      _id: req.params.id,
    });
    if (!user) {
      throw new Error("user does not exists.");
    }
    // if (password !== user.password) {
    //   throw new Error('please provide a valid password.')
    // }
    // body = _.omit(body, ['password'])

    await User.updateOne(
      {
        _id: req.params.id,
      },
      body,
      { upsert: true }
    );

    const updatedUser = await User.findOne({
      _id: req.params.id,
    });
    res.status(200).send({
      status: "success",
      message: "information updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
      data: {},
    });
  }
};

exports.transferToChainCtrl = async (req, res, next) => {
  try {
    let {
      body,
      body: { id, onChainAmount: amountToTransfer },
    } = req;

    body.gasLimit = "100000";
    const user = await User.findOne({
      _id: id,
    });
    if (!user) {
      throw new Error("user does not exist.");
    }
    if (
      !user.offChainAmount ||
      user.offChainAmount < parseInt(amountToTransfer)
    ) {
      throw new Error("Insufficent amount.");
    }
    const remainingAmountAfterTransfer =
      user.offChainAmount - parseInt(amountToTransfer);
    const resp = await transferToChainHelper({
      Address: body.walletAddress,
      Amount: parseInt(amountToTransfer),
      gasLimit: body.gasLimit,
      user,
      remainingAmountAfterTransfer,
    });

    res.status(200).send({
      status: "success",
      message: "Your coins are transferred to the chain successfully",
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
      data: {},
    });
  }
};

exports.transferOffChain = async (req, res, next) => {
  let {
    body: { id, offChainAmount },
  } = req;
  try {
    const user = await User.findOne({
      _id: id,
    });
    if (!user) {
      throw new Error("user does not exist.");
    }
    await User.updateOne(
      {
        _id: id,
      },
      {
        offChainAmount: parseInt(offChainAmount),
      },
      { upsert: true }
    );

    res.status(200).send({
      status: "success",
      message: "success",
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
      data: {},
    });
  }
};

exports.getOffChainAndOnChainBalanceFromDb = async (req, res, next) => {
  try {
    let {
      params: { id },
    } = req;
    const user = await User.findOne({
      _id: id,
    });
    if (!user) {
      throw new Error("user does not exist.");
    }
    const data = {
      offChainAmount: user.offChainAmount,
      onChainAmount: user.onChainAmount,
    };
    res.status(200).send({
      data,
      status: "success",
      message: "success",
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
      data: {},
    });
  }
};

exports.topUpOffChainWithVoucher = async (req, res, next) => {
  try {
    let {
      body,
      body: { txId, id },
    } = req;
    console.log("user id", id);
    console.log("voucher code", txId);

    const voucherAlreadyExists = await VoucherHistory.findOne({
      txId,
    });
    if (voucherAlreadyExists) {
      throw new Error("this voucher has already been redeemed.");
    }
    const user = await User.findOne({
      _id: id,
    });

    if (!user) {
      throw new Error("user does not exists.");
    }
    var resp = await topUpOffChainWithVoucherHelper({
      walletAddress: user.walletAddress,
      Txid: txId,
    });

    if (resp.Res == "Verified") {
      var data = await VoucherHistory.create({
        txId: resp.Txid,
        amount: resp.amount,
        userId: id,
        isRedeemed: true,
      });
      const updatedAmount =
        parseInt(user.offChainAmount) + parseInt(resp.amount);
      await User.updateOne(
        {
          _id: id,
        },
        { offChainAmount: updatedAmount },
        { upsert: true }
      );
    } else {
      throw new Error("user does not exists.");
    }
    res.status(200).send({
      data: { amount: resp.amount },
      status: "success",
      message: "top up added successfully",
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
      data: {},
    });
  }
};

exports.confirmPassword = async (req, res) => {
  try {
    let {
      body: { password, id },
    } = req;

    const user = await User.findOne({
      password,
      id,
    });

    if (user) {
      res.status(200).send({
        data: {},
        status: "success",
        message: "password confirmed",
      });
    } else {
      throw new Error("invalid password.");
    }
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
      data: {},
    });
  }
};
