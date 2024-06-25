const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const { createNewSheet } = require("../googleSheet/googleSheetHandler");

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
  const loggedInUserId = req.params.id;
  const keyword = req.query.search;

  try {
    // Tìm kiếm người dùng theo username và loại bỏ người dùng hiện tại
    const users = await User.find({
      username: { $regex: keyword, $options: "i" }, // Tìm kiếm không phân biệt hoa thường
      _id: { $ne: loggedInUserId }, // Loại bỏ người dùng hiện tại
    });

    // Lấy danh sách bạn bè của người dùng hiện tại
    const currentUser = await User.findById(loggedInUserId).populate(
      "friends",
      "username"
    );

    // if (currentUser.friends.length === 0) return res.json([]);

    const friends = currentUser.friends;

    const friendIds = friends.map((friend) => friend._id.toString());

    // Tạo danh sách kết quả với thông tin đã kết bạn
    const searchResults = users.map((user) => {
      const request = user.friend_requests.map((request) => {
        return request._id.toString();
      });
      return {
        id: user._id,
        username: user.username,
        avatar: user.avatar,
        email: user.email,
        isFriend: friendIds.includes(user._id.toString()), // Kiểm tra xem có phải là bạn bè không
        sentRequest: request.includes(currentUser._id.toString()),
      };
    });

    // console.log(searchResults);
    res.json(searchResults);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { id, username, avatar, currentPassword, newPassword } = req.body;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ msg: "User not found" });
  const isMatchPassword = await user.matchPassword(currentPassword);
  if (!isMatchPassword) {
    console.log("mat khau khong dung");
    return res.status(401).json({ msg: "Password is incorrect" });
  }
  if (newPassword) {
    user.password = newPassword;
  }
  if (user.username !== username) {
    console.log("doi ussernaem");
    user.username = username;
  }
  if (user.avatar !== avatar) {
    console.log("doi avatar");
    user.avatar = avatar;
  }
  const updatedUser = await user.save();

  res.json(updatedUser);
});

module.exports = {
  allUsers,
  updateUser,
};
