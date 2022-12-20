const express = require("express");

const router = express.Router();

const groupController = require("../controllers/group");

const autho = require("../middleware/authentication");

router.post("/createGroup", autho.authorization, groupController.CreateGroup);
router.get("/allGroups", autho.authorization, groupController.getAllGroups);
router.post("/openGroup", autho.authorization, groupController.openGroup);
//router.post("/joinGroup", autho.authorization, groupController.joinGroup);

router.post("/contacts", autho.authorization, groupController.contacts);
router.post("/addToGroup", autho.authorization, groupController.addTogroup);
router.post("/participants", autho.authorization, groupController.participants);

module.exports = router;
