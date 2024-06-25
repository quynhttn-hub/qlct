const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // mess của bot : sender = ""
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isBot: { type: Boolean }, //true nếu là tin nhắn của bot, false nếu không,
    mention: {
      value: { type: String, trim: true },
      position: { type: Number },
    },
    category: {
      value: { type: String, trim: true },
      position: { type: Number },
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
