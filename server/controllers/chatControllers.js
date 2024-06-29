const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const {
  createNewSheet,
  createNewSheetForGroup,
  readTotalSpending,
} = require("../googleSheet/googleSheetHandler");

const getChat = asyncHandler(async (req, res) => {
  const { userID, authID } = req.params;

  try {
    // Tìm đoạn chat có users chỉ chứa đúng [userID, authID]
    const chat = await Chat.findOne({
      users: { $all: [userID, authID], $size: 2 },
    });

    if (!chat) {
      return res
        .status(404)
        .json({ message: "No chat found with the specified users" });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error finding chat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const createChatOneToOne = asyncHandler(async (req, res) => {
  const { myId, userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: myId } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users chatName", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "username avatar email",
  });

  const sender = await User.findById(userId);

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: sender.name,
      isGroupChat: false,
      users: [myId, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "username avatar email"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const editChat = asyncHandler(async (req, res) => {
  const { chatId, newName } = req.body;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    if (newName) chat.chatName = newName;
    if (req.body.newUsers) chat.users = JSON.parse(req.body.newUsers);

    const updatedChat = await chat.save();

    console.log(updatedChat);

    const fullGroupChat = await Chat.findOne({ _id: chatId })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const getChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.params.id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        if (!results) {
          return res.status(200).send([]);
        }
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "username avatar email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});



//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = asyncHandler(async (req, res) => {
  var users = JSON.parse(req.body.users);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.body.groupAdmin,
      // sheetId
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createSheetForChat = asyncHandler(async (req, res) => {
  const { chatId } = req.body;

  try {
    // Tìm chat theo chatId
    const chat = await Chat.findById(chatId);

    // Lấy danh sách user IDs từ chat
    const users = chat.users;

    // Sử dụng Promise.all để chờ tất cả các truy vấn findById hoàn thành
    const userEmails = await Promise.all(
      users.map(async (userId) => {
        const user = await User.findById(userId).select("email");
        return user.email;
      })
    );

    const sheetLink = await createNewSheet(userEmails);

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { sheetLink },
      { new: true, runValidators: true }
    );

    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    // res.send({ sheetId });

    // Trả về danh sách email
    res.status(200).json({ sheetLink: sheetLink });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});



// @desc    check xem chat với bản thân có chưa, có rồi thì trả về, chưa thì tạo mới chat users chỉ có bản thân mình
// @route   get /api/chat/myself
// @access  Protected
const mySelfChat = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const chat = await Chat.find({
    users: { $size: 1, $elemMatch: { $eq: userId } },
  });

  // console.log(chat);

  // nếu không có chat thì tạo chat
  if (chat.length == 0) {
    const newChat = await Chat.create({
      chatName: "My Self Chat",
      users: [userId],
      isGroupChat: false,
    });
    res.json(newChat);
  } else {
    res.json(chat);
  }
});

const getSpending = asyncHandler(async (req, res) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    if (chat.sheetLink) {
      const spending = await readTotalSpending(chat.sheetLink);
      res.json(spending);
    } else {
      res.json(0);
    }
  }
});
module.exports = {
  createChatOneToOne,
  getChats,
  createGroupChat,
  createSheetForChat,
  mySelfChat,
  getSpending,
  getChat,
  editChat,
};
