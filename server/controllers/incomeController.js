const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const {
  convertStringToNumber,
  writeGGSheet,
  writeCategory,
} = require("../googleSheet/googleSheetHandler");
const Mention = require("../models/mentionModel");
const Category = require("../models/categoryModel");
const Income = require("../models/incomeModel");

const createIncome = asyncHandler(async (req, res) => {
  const { name, chatId } = req.body;

  const chat = await Chat.findById(chatId);

  const income = await Income.findOne({
    name: { $regex: new RegExp(name, "i") },
  });

  if (income) {
    res.status(403);
    throw new Error("Danh mục đã tồn tại!");
  }

  if (chat.sheetId) {
    // todo write income
    // await writeCategory(name, chat.sheetId)
  }

  try {
    const newIncome= await Income.create({
      name,
      chatId,
    });

    res.send(newIncome);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const deleteIncome = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const deletedIncome = await Income.findByIdAndDelete(id);
    res.send(deletedIncome);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id, name } = req.body;
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name,
      },
      {
        new: true,
      }
    );
    res.send(updatedCategory);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const getAllIncome = asyncHandler(async (req, res) => {
  const chatId = req.params.id;
  try {
    const incomes = await Income.find({ chatId }).select("name");

    res.send(incomes);
  } catch (error) {
    res.status(400);
    res.send({ message: error.message });
  }
});

module.exports = {
  deleteIncome,
  updateCategory,
  getAllIncome,
  createIncome,
};
