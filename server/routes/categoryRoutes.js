const express = require("express");
const {
  createCategory,
  deleteCategory,
  getAllCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:id").get(protect, getAllCategory);
router.route("/create").post(protect, createCategory);
router.route("/delete/:id").delete(protect, deleteCategory);

module.exports = router;
