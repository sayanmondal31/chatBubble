const router = require("express").Router();

const { login, register, getUsers } = require("../controller/userController");

router.post("/register", register);
router.post("/login", login);
router.get("/userList", getUsers);

module.exports = router;
