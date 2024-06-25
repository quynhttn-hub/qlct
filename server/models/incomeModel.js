const mongoose = require("mongoose");

const incomeSchema = mongoose.Schema(
  {
    name: { type: String, trim: true },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",}
  },
  { timestamps: true }
);

const Income = mongoose.model("Income", incomeSchema);
module.exports = Income;
