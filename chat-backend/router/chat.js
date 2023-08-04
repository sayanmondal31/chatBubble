const router = require("express").Router();

const { getMessages } = require("../controller/chatController");

router.get("/messages", getMessages);

module.exports = router;
