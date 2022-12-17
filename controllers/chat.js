const Chat = require("../models/chat");
const User = require("../models/user");

exports.getAllChat = async (req, res) => {
  const chats = await Chat.findAll();
  const user = await User.findAll();
  res.json({ data: chats, name: user });
};

exports.sendChat = async (req, res, next) => {
  const message = req.body.message;
  const data = await Chat.create({ chat: message, userId: req.user.id });
  res.json({ data: data, msg: "success", name: req.user.name });
};
