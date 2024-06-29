const express = require("express");
const {
  createChatOneToOne,
  getChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
  createSheetForChat,
  mySelfChat,
  getSpending,
  getChat,
  editChat,
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");
const { protectRoute } = require("../middleware/protectRoute");

const router = express.Router();

router.route("/").post(protect, createChatOneToOne);
router.route("/:id").get(protect, getChats);
router.route("/find/:userID/:authID").get(protect, getChat);
router.route("/myself/:id").get(protect, mySelfChat);
router.route("/createfile").post(protect, createSheetForChat);
router.route("/spending/:id").get(protect, getSpending);
router.route("/edit").post(protect, editChat);

// router.route("/group").post(protect, createGroupChat);
router.route("/group").post(createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);

module.exports = router;
