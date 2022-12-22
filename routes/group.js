const express = require("express");

const router = express.Router();

const groupController = require("../controllers/group");

const autho = require("../middleware/authentication");

router.post("/createGroup", autho.authorization, groupController.CreateGroup);
router.get("/allGroups", autho.authorization, groupController.getAllGroups);
router.post("/openGroup", autho.authorization, groupController.openGroup);

router.post("/contacts", autho.authorization, groupController.contacts);
router.post("/addToGroup", autho.authorization, groupController.addTogroup);
router.post("/participants", autho.authorization, groupController.participants);
router.post(
  "/removeFromGroup",
  autho.authorization,
  groupController.removeFromGroup
);
router.post("/makeAdmin", autho.authorization, groupController.makeAdmin);
router.post("/groupExit", autho.authorization, groupController.groupExit);
module.exports = router;
