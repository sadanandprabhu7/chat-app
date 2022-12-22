const Group = require("../models/group");
const UserGroup = require("../models/user-group");
const Chat = require("../models/chat");
const User = require("../models/user");
const sequelize = require("sequelize");
const { Op } = sequelize;

exports.CreateGroup = async (req, res, next) => {
  const name = req.body.name;

  const ressult = await req.user.createGroup({ name });
  const data = await UserGroup.update(
    { isAdmin: true },
    { where: { userId: req.user.id } }
  );

  res.status(200).json({ msg: "sucessfully created" });
};

exports.getAllGroups = async (req, res, next) => {
  const result = await req.user.getGroups();

  res.status(200).json({ data: result });
};

exports.openGroup = async (req, res, next) => {
  // chats of group and person name whoe's chat is there

  const chats = await Chat.findAll({
    limit: 5,
    order: [["id", "DESC"]],
    where: { groupId: req.body.groupId },
    include: [{ model: User, attributes: ["id", "name"] }], // inculde here we are including model where in chat userid is promarykey so we have included user mode and only getting from there name and id associated with chat
  });
  res.status(200).json({ data: chats, userId: req.user.id });
};

async function isAdmin(userId, groupId) {
  const result = await UserGroup.findOne({
    where: { userId, groupId },
  });
  if (result.isAdmin === null) {
    return false;
  } else {
    return true;
  }
}
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
  const admin = await isAdmin(req.user.id, groupId);
  if (admin === false) {
    return res.json({ msg: "you are not Authorized" });
  } else {
    const data = await UserGroup.findOne({ where: { userId, groupId } });
    if (data !== null) {
      return res.json({ msg: "user is Already added to group" });
    } else {
      const result = await UserGroup.create({
        userId,
        groupId,
      });
      res.status(200).json({ msg: "successfully added" });
    }
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
  const admin = await UserGroup.findAll({
    where: {
      userId: userIds,
    },
    attributes: ["userId", "isAdmin"],
    group: ["userId"],
  });

  res
    .status(200)
    .json({ data: filteredUsers, admin: admin, userId: req.user.id });
};
exports.removeFromGroup = async (req, res) => {
  const groupId = req.body.groupId;
  const userId = req.body.userId;
  const admin = await isAdmin(req.user.id, groupId);
  if (admin === true) {
    const removed = await UserGroup.destroy({ where: { userId: userId } });
    res.status(200).json({ msg: " successfully removed" });
  } else {
    res.status(200).json({ msg: "you are not Authorized" });
  }
};
exports.makeAdmin = async (req, res) => {
  const userId = req.body.userId;
  const admin = await isAdmin(req.user.id, req.body.groupId);
  if (admin === true) {
    const result = await UserGroup.update(
      { isAdmin: true },
      { where: { userId: userId, groupId: req.body.groupId } }
    );
    res.status(200).json({ msg: "successfully marked as admin" });
  } else {
    return res.status(401).json({ msg: "you are not Authorized" });
  }
};
exports.groupExit = async (req, res) => {
  const { userId, groupId } = req.body;
  const result = await UserGroup.destroy({ where: { userId, groupId } });
  res.status(200).json({ msg: "successfull exit" });
};
