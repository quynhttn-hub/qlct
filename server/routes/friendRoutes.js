const express = require("express");

const {
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  unFriend,
  cancelFriendRequest,
} = require("../controllers/friendControllers.js");

const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/get/:id", protect, getFriends);

router.post("/request", protect, sendFriendRequest);
router.get("/getrequest/:id", protect, getFriendRequests);

router.post("/accept", protect, acceptFriendRequest);
router.post("/unfiend", protect, unFriend);
router.post("/cancelFriendRequest", protect, cancelFriendRequest);

module.exports = router;
