const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.authorization = async (req, res, next) => {
  const token = req.header("Authorization");
  //console.log(">>>>>>>>>>,my token", token);
  const obj = jwt.verify(token, "sadanadSecreteKey");
  const { userId } = obj;
  const user = await User.findByPk(userId);
  //console.log("usr id  my >>>>>>>>>", user.id);
  req.user = user;
  next();
};
