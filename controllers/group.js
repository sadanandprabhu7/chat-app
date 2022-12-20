const Group = require("../models/group");
const UserGroup = require("../models/user-group");
const Chat = require("../models/chat");
const User = require("../models/user");
const sequelize = require("sequelize");
const { Op } = sequelize;

exports.CreateGroup = async (req, res, next) => {
  const name = req.body.name;
  const ressult = await req.user.createGroup({ name });
  res.status(200).json({ msg: "sucessfully created" });
};

exports.getAllGroups = async (req, res, next) => {
  const result = await req.user.getGroups();
  res.status(200).json({ data: result });
};

exports.openGroup = async (req, res, next) => {
  // chats of group and person name whoe's chat is there

  const chats = await Chat.findAll({
    where: { groupId: req.body.groupId },
    include: [{ model: User, attributes: ["id", "name"] }], // inculde here we are including model where in chat userid is promarykey so we have included user mode and only getting from there name and id associated with chat
  });

  res.status(200).json({ data: chats });
};

//getting all users who are not present in group to add them in group
exports.contacts = async (req, res, next) => {
  const groupId = req.body.groupId;
  const results = await UserGroup.findAll({
    where: {
      groupId: groupId,
    },
    attributes: ["userId"],
    group: ["userId"],
  });
  const userIds = results.map((result) => result.userId);
  const filteredUsers = await User.findAll({
    where: {
      id: { [Op.notIn]: userIds },
    },
  });
  res.status(200).json({ data: filteredUsers });
};

exports.addTogroup = async (req, res, next) => {
  const { userId, groupId } = req.body;
  const find = await UserGroup.findOne({ where: { userId, groupId } });
  if (find.length > 0) {
    return res.status(200).json({ msg: "user is Already added to group" });
  } else {
    const result = await UserGroup.create({
      userId,
      groupId,
    });
    res.status(200).json({ msg: "successfully added" });
  }
};

//show particular group all participants
exports.participants = async (req, res, next) => {
  const groupId = req.body.groupId;
  const results = await UserGroup.findAll({
    where: {
      groupId: groupId,
    },
    attributes: ["userId"],
    group: ["userId"],
  });
  const userIds = results.map((result) => result.userId);
  const filteredUsers = await User.findAll({
    where: {
      id: userIds,
    },
    attributes: ["id", "name"],
  });
  res.status(200).json({ data: filteredUsers });
};
