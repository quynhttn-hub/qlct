const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
  createSheet,
  mySelfChat,
  getSpending,
  getChat,
  editChat,
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");
const { protectRoute } = require("../middleware/protectRoute");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/:id").get(protect, fetchChats);
router.route("/find/:userID/:authID").get(protect, getChat);
router.route("/myself/:id").get(protect, mySelfChat);
router.route("/createfile").post(protect, createSheet);
router.route("/spending/:id").get(protect, getSpending);
router.route("/edit").post(protect, editChat);

// router.route("/group").post(protect, createGroupChat);
router.route("/group").post(createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);

module.exports = router;
