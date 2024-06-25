const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: { type: String, trim: true },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",}
  },
  { timestamps: true }
);

const category = mongoose.model("Category", categorySchema);
module.exports = category;
