const User = require("../models/user");
const bcrypt = require("bcrypt");
const { where } = require("sequelize");

exports.userRegistration = async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  const exist = await User.findAll({ where: { email: email } });
  if (exist.length > 0) {
    return res.json({ msg: "user already exist" });
  } else {
    console.log(name);
    const salt = 10;
    bcrypt.hash(password, salt, async (err, encrypted) => {
      const saved = await User.create({
        name,
        email,
        phone,
        password: encrypted,
      });

      res.json({ data: saved, msg: "successfull registration" });
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findAll({ where: { email: email } });
  if (user.length > 0) {
    bcrypt.compare(password, user[0].password, (err, found) => {
      if (err) {
        return res.json({ msg: "something went wrong" });
      }
      if (found) {
        res.json({ msg: "successful login" });
      } else {
        return res.json({ msg: "incorrect password" });
      }
    });
  } else {
    return res.json({ msg: "user does not exist" });
  }
};
