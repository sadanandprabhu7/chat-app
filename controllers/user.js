const User = require("../models/user");
const bcrypt = require("bcrypt");

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
