const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Mention = require("../models/mentionModel");
const Category = require("../models/categoryModel");

const createCategory = asyncHandler(async (req, res) => {
  const { name, chatId } = req.body;

  const chat = await Chat.findById(chatId);


 const category = await Category.findOne({
   chatId,
   name: { $regex: new RegExp(`^${name}$`, "i") },
 });



  if (category) {
    res.status(403);
    throw new Error("Danh mục đã tồn tại!");
  }


  try {
    const newCategory = await Category.create({
      name,
      chatId,
    });

    res.send(newCategory);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    res.send(deletedCategory);
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

const getAllCategory = asyncHandler(async (req, res) => {
  const chatId = req.params.id;
  try {
    const categories = await Category.find({ chatId }).select("name");

    res.send(categories);
  } catch (error) {
    res.status(400);
    res.send({ message: error.message });
  }
});

module.exports = {
  createCategory,
  deleteCategory,
  updateCategory,
  getAllCategory,
};
