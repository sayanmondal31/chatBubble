const { Schema, model } = require("mongoose");

const chatSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Chat", chatSchema);
