const User = require("../model/user");
const crypto = require("crypto");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = new User({
      username,
      email,
      password,
    });
    await user.save();

    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const user = await User.findOne({ email, password });
    console.log(user);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = crypto.randomBytes(64).toString("hex");

    res.status(200).json({ token, user });
  } catch (error) {
    console.log(error);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
  }
};
