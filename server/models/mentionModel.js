const mongoose = require("mongoose");

const mentionSchema = mongoose.Schema(
  {
    name: { type: String, trim: true },
    start: { type: Number },
  },
  { timestamps: true }
);

const Mention = mongoose.model("Mention", mentionSchema);
module.exports = Mention;
