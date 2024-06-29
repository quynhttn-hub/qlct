const express = require("express");
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

module.exports = router;
