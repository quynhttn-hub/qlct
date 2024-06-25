const express = require("express");
const { allUsers, updateUser } = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");
const { protectRoute } = require("../middleware/protectRoute");

const router = express.Router();

router.route("/:id").get(protect, allUsers);
router.post("/update", protect, updateUser);

module.exports = router;
