const User = require("../models/user.model");
const { client } = require("../helpers/tcp_connection")
const {
  blockChainHelper,
  getBalanceHelper,
  transferToChainHelper,
} = require("../helpers/web3client");
exports.create = async (req, res, next) => {
  try {
    console.log("request :", req);
    const user = await User.findOne({
      userEmail: req.body.userEmail,
    });
    if (user) {
      throw new Error('user already exists.')
    }
    const transaction = await User.create(req.body);
    const responseFromW3 = await blockChainHelper(req.body, transaction.id);
    console.log("res", responseFromW3);
    console.log("user and transaction :", transaction);

    res.status(200).send({
      status: "success",
      message: "your account has been registered successfully",
      data: transaction
    });
  } catch (error) {
    next(error);
  }
}

exports.signIn = async (req, res, next) => {
  try {
    const { body: { userEmail, password } } = req;
    const user = await User.findOne({
      userEmail,
    });
    if (!user) {
      throw new Error('user does not exists.')
    }
    if (user.password !== password) {
      throw new Error('invalid username /password.')
    } else {
      res.status(200).send({
        status: "success",
        message: "your have signed in successfully",
        data: user
      });
    }
  } catch (err) {
    next(error);
  }
}
exports.index = async (req, res, next) => {
  try {
    const users = await User.find({});
    console.log("array of all the users and transactions :", users);

    res.status(200).send({
      status: "success",
      message: "list of all the users",
      data: users
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingle = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
    });
    if (!user) {
      throw new Error('user does not exists.')
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
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    let {
      body
    } = req;
    const user = await User.findOne({
      _id: req.params.id,
    });
    if (!user) {
      throw new Error('user does not exists.')
    }
    await User.updateOne({
      _id: req.params.id
    }, body, { upsert: true })

    res.status(200).send({
      status: "success",
      message: "information updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.transferToChainCtrl = async (req, res, next) => {
  try {
    let {
      body,
      body: {
        id,
        onChainAmount: amountToTransfer,
      }
    } = req;

    body.gasLimit = "100000"
    const user = await User.findOne({
      _id: id,
    });
    if (!user) {
      throw new Error('user does not exist.')
    }
    if (!user.offChainAmount || user.offChainAmount < parseInt(amountToTransfer)) {
      throw new Error('Insufficent amount.')
    }
    const remainingAmountAfterTransfer = user.offChainAmount - parseInt(amountToTransfer)
    const resp = await transferToChainHelper({ Address: body.walletAddress, Amount: parseInt(amountToTransfer), gasLimit: body.gasLimit, user, remainingAmountAfterTransfer });

    res.status(200).send({
      status: "success",
      message: "Your coins are transferred to the chain successfully",
    });
  } catch (error) {
    next(error);
  }
}

exports.transferOffChain = async (req, res, next) => {
  let {
    body: {
      id,
      offChainAmount
    }
  } = req;
  try {
    const user = await User.findOne({
      _id: id,
    });
    if (!user) {
      throw new Error('user does not exist.')
    }
    const amountAfterAddition = user.offChainAmount + parseInt(offChainAmount)
    await User.updateOne({
      _id: id
    }, {
      offChainAmount: amountAfterAddition
    }, { upsert: true })

    res.status(200).send({
      status: "amount added successfully",
      message: "success",
    });
  } catch (error) {
    next(error)
  }
}

exports.getOffChainAndOnChainBalanceFromDb = async (req, res, next) => {
  try {
    let {
      params: {
        id
      }
    } = req;
    const user = await User.findOne({
      _id: id,
    });
    if (!user) {
      throw new Error("user does not exist.")
    }
    const data = {
      offChainAmount: user.offChainAmount,
      onChainAmount: user.onChainAmount
    }
    res.status(200).send({
      data,
      status: "amount added successfully",
      message: "success",
    });
  } catch (error) {
    next(error)
  }
}