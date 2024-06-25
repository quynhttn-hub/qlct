const express = require("express");
const {
  allMessages,
  sendMessage,
  deleteMessage,
  updateMessage,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");
const { protectRoute } = require("../middleware/protectRoute");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);
router.delete("/delete/:messageId",protect,  deleteMessage);
router.put("/update/:messageId",protect,  updateMessage);

module.exports = router;
