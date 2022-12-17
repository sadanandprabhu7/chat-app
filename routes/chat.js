const express = require("express");

const router = express.Router();

const chatController = require("../controllers/chat");

const autho = require("../middleware/authentication");

router.get("/chats", autho.authorization, chatController.getAllChat);

router.post("/msg", autho.authorization, chatController.sendChat);

module.exports = router;
