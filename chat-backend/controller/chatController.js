const Chat = require("../model/chat");
var { ObjectId } = require("mongodb");

exports.getMessages = async (req, res) => {
  try {
    const { sender, receiver } = req.query;

    const messages = await Chat.find({
      $or: [
        { sender: new ObjectId(sender), receiver: new ObjectId(receiver) },
        { sender: new ObjectId(receiver), receiver: new ObjectId(sender) },
      ],
    });

    res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
  }
};
