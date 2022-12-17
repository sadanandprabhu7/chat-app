const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.authorization = async (req, res, next) => {
  const token = req.header("Authorization");

  const obj = jwt.verify(token, "sadanadSecreteKey");
  const { userId } = obj;
  const user = await User.findByPk(userId);
  console.log(user.id);
  req.user = user;
  next();
};
