const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Friendship = require("../models/friendshipModel");

const getFriends = asyncHandler(async (req, res) => {
  const userId = req.params.id;


  try {
    const user = await User.findById(userId).populate(
      "friends",
      "username avatar email"
    );
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

const sendFriendRequest = asyncHandler(async (req, res) => {
  const { authId, userId } = req.body;

  if (authId === userId) {
    return res
      .status(400)
      .json({ msg: "You cannot send friend request to yourself" });
  }

  try {
    // Kiểm tra xem yêu cầu đã tồn tại chưa
    let friendship = await Friendship.findOne({
      $or: [
        { user1_id: authId, user2_id: userId },
        { user1_id: userId, user2_id: authId },
      ],
    });

    if (friendship) {
      return res.status(400).json({ msg: "Friend request already sent" });
    }

    // Tạo yêu cầu kết bạn mới
    friendship = new Friendship({ user1_id: authId, user2_id: userId });
    await friendship.save();

    // Cập nhật yêu cầu kết bạn cho người dùng đích
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { friend_requests: authId } },
        { new: true } // Tùy chọn này trả về tài liệu đã được cập nhật
      );
    } catch (error) {
      res.status(201).json({ msg: "Failed" });
    }

    // const user = await User.findById(userId).populate("username");

    res.status(201).json({ msg: "Friend request sent" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

const acceptFriendRequest = asyncHandler(async (req, res) => {
  const { userId, accepterId } = req.body; // userId là ID của người gửi yêu cầu kết bạn
  try {
    // Tìm yêu cầu kết bạn và cập nhật trạng thái
    const friendship = await Friendship.findOneAndUpdate(
      { user1_id: userId, user2_id: accepterId, status: false },
      { status: true },
      { new: true }
    );

    if (!friendship) {
      return res
        .status(400)
        .json({ msg: "Friend request not found or already accepted" });
    }

    // Cập nhật danh sách bạn bè của cả hai người dùng
    await User.findByIdAndUpdate(accepterId, {
      $push: { friends: userId },
      $pull: { friend_requests: userId },
    });
    await User.findByIdAndUpdate(userId, { $push: { friends: accepterId } });

    // Lấy danh sách bạn bè của accepterId
    const accepter = await User.findById(accepterId).populate(
      "friends",
      "username avatar email"
    );
    const friendsList = accepter.friends.map((friend) => ({
      id: friend._id,
      username: friend.username,
      email: friend.email,
      avatar: friend.avatar,
    }));

    res
      .status(200)
      .json({ msg: "Friend request accepted", friends: friendsList });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

const getFriendRequests = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  console.log(userId);


  try {
    const user = await User.findById(userId).populate(
      "friend_requests",
      "username avatar"
    );

    if (!user) return res.status(404).json({ msg: "User not found" });

    // Lấy danh sách yêu cầu kết bạn và trả về với id, username, avatar
    const friendRequests = user.friend_requests.map((request) => ({
      id: request._id,
      username: request.username,
      avatar: request.avatar,
    }));

    if (!friendRequests) res.json([]);

    res.json( friendRequests);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


const unFriend = asyncHandler(async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    // Kiểm tra người dùng có tồn tại không
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Xóa friendId khỏi danh sách bạn bè của user
    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    await user.save();

    // Xóa userId khỏi danh sách bạn bè của friend
    friend.friends = friend.friends.filter((id) => id.toString() !== userId);
    await friend.save();

    // Xóa bản ghi friendship trong database
    await Friendship.findOneAndDelete({
      $or: [
        { user1_id: userId, user2_id: friendId },
        { user1_id: friendId, user2_id: userId },
      ],
    });

    res.status(200).json({ msg: "Unfriended successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
})  
 

const cancelFriendRequest = asyncHandler(async (req, res) => {
  const { userId, friendId } = req.body;
  console.log(userId, friendId);
  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    if (!user || !friend) {
      return res.status(404).json({ msg: "User not found" });
    }
    user.friend_requests = user.friend_requests.filter(
      (id) => id.toString() !== friendId
    );

    // Xóa friendShip
    await Friendship.findOneAndDelete({
      $or: [
        { user1_id: userId, user2_id: friendId },
        { user1_id: friendId, user2_id: userId },
      ],
    });

    await user.save();
    res.status(200).json({ msg: "Friend request canceled" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = {
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  unFriend,
  cancelFriendRequest,
};
