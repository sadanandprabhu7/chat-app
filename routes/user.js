const express = require("express");

const router = express.Router();

const userController = require("../controllers/user");

router.post("/save", userController.userRegistration);

module.exports = router;
