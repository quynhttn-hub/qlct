const express = require("express");
const { protectRoute } = require("../middleware/protectRoute");
const { createCategory, deleteCategory, updateCategory, getAllCategory } = require("../controllers/categoryController");
const {
  createIncome,
  getAllIncome,
  deleteIncome,
} = require("../controllers/incomeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:id").get(protect, getAllIncome);
router.route("/create").post(protect, createIncome);
router.route("/delete/:id").delete(protect, deleteIncome);
router.route("/update").post(protect, updateCategory);

module.exports = router;
