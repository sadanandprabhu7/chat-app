const Chat = require("../models/chat");
const User = require("../models/user");

exports.getAllChat = async (req, res) => {
  const chats = await Chat.findAll({
    limit: 5,

    order: [["id", "DESC"]],
  });
  const user = await User.findAll();
  res.json({ data: chats, name: user, addName: req.user.name });
};

exports.sendChat = async (req, res, next) => {
  const message = req.body.message;
  const data = await req.user.createChat({ chat: message });
  res.json({ data: data, msg: "success", name: req.user.name });
};
