const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const {
  convertStringToNumber,
  writeGGSheet,
  readRemaining,
} = require("../googleSheet/googleSheetHandler");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username avatar email")
      .populate("chat")
      .populate("mention")
      .populate("category");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { mention, category, content, chatId, writedUserEmail } = req.body;

  if (!content || !chatId) {
    return res.sendStatus(405);
  }

  var newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
    mention: mention ? mention : {},
    category: category ? category : {},
  };

  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "username avatar");
    message = await message.populate("chat");

    message = await User.populate(message, {
      path: "chat.users",
      select: "username avatar email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    message = await message.populate("mention category");
    // res.json(message);

    const chat = await Chat.findById(req.body.chatId);
    if (!mention) {
      res.status(200).json({
        message,
        msg:"Gửi tin nhắn thành công. Bạn có thể sửa tin nhắn trong vòng 5 phút"
      });
    }
    // ghi vào file
    if (mention) {
      // nếu không có sheetId
      if (!chat.sheetLink) {
        res.status(200).json({
          message,
          msg: "Vui lòng tạo file quản lý để có thể ghi thông tin vào file",
        });
      } else {
        // Sau 5 phút, lưu tin nhắn vào Google Sheets
        setTimeout(async () => {
          const messageAfter5Min = await Message.findById(message._id);
          if (!messageAfter5Min) {
            return;
          }
          const mentionAfter5Min = messageAfter5Min.mention;
          const categoryAfter5Min = messageAfter5Min.category;
          const contentAfter5Min = messageAfter5Min.content;

          if (
            JSON.stringify(categoryAfter5Min) === "{}" ||
            JSON.stringify(mentionAfter5Min) === "{}"
          ) {
            return;
          }

          const sliceRemainingData = contentAfter5Min.slice(
            mentionAfter5Min.position,
            categoryAfter5Min.value.length + categoryAfter5Min.position + 1
          );
          const remainingData = contentAfter5Min
            .replace(sliceRemainingData, "")
            .trim();

          if (
            !remainingData ||
            !mentionAfter5Min.value ||
            !categoryAfter5Min.value
          ) {
            return;
          }
          await writeGGSheet(
            mentionAfter5Min.value,
            categoryAfter5Min.value,
            remainingData,
            chat.sheetLink,
            writedUserEmail
          )
            .then(() => {})
            .catch((error) => {
              console.log(error);
            });
        }, 300000); // sửa lại nha

        if (!category) {
          res.status(200).json({
            message,
            msg: "Nhập đầy đủ hạng mục chi tiêu",
          });
        } else {
          const sliceRemaining = content.slice(
            mention.position,
            category.value.length + category.position + 1
          );
          const remain = content.replace(sliceRemaining, "").trim();
          let money;
          let note = "";
          // Bước 2: Tách chuỗi thành hai phần dựa trên khoảng trắng đầu tiên

          const firstSpaceIndex = remain.indexOf(" ");
          if (firstSpaceIndex === -1) {
            money = convertStringToNumber(remain);
            note = "";
          } else {
            money = convertStringToNumber(remain.substring(0, firstSpaceIndex));
            note = remain.substring(firstSpaceIndex + 1);
          }

          if (!money) {
            res.status(200).json({
              message,
              msg: `Vui lòng nhập số tiền bạn ${mention.value} `,
            });
          } else {
            const remaining = await readRemaining(chat.sheetLink);
            if (mention.value == "chi tiêu" && remaining - money < 0) {
              res.status(200).json({
                message,
                msg: "Bạn đã chi tiêu vượt quá giới hạn. Bạn có thể chỉnh sửa tin nhắn trong 5 phút. Sau 5 phút thông tin sẽ được lưu vào file",
              });
            } else {
              res.status(200).json({
                message,
                
                msg: "Gửi tin nhắn thành công. Bạn có thể chỉnh sửa tin nhắn trong 5 phút. Sau 5 phút thông tin sẽ được lưu vào file",
              });
            }
          }
        }
      }

      // }
    }
  } catch (error) {
    res.status(401);
    console.log(error);
  }
});

const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }

    const currentTime = new Date();
    const timeDifference = (currentTime - message.createdAt) / 1000 / 60; // Thời gian chênh lệch tính bằng phút

    if (timeDifference > 5) {
      return res.status(403).json({
        msg: "Bạn chỉ có thể xóa  tin nhắn trong vòng 5 phút kể từ khi gửi",
      });
    }

    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ msg: "Message deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

const updateMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { content, mention, category, chatId } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ msg: "Chat not found" });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }

    const currentTime = new Date();
    const timeDifference = (currentTime - message.createdAt) / 1000 / 60; // Time difference in minutes

    if (timeDifference > 5) {
      return res.status(403).json({
        msg: "Bạn chỉ có thể sửa tin nhắn trong vòng 5 phút kể từ khi gửi",
      });
    }

    message.content = content;
    message.mention = mention;
    message.category = category;
    await message.save();

    let messageUpdated = await Message.findById(messageId)
      .populate("sender", "username avatar")
      .populate("chat");

    if (mention) {
      if (!chat.sheetLink) {
        return res.status(200).json({
          message: messageUpdated,
          msg: "Vui lòng tạo file quản lý để có thể ghi thông tin vào file",
        });
      }

      if (!category) {
        return res.status(200).json({
          message: messageUpdated,
          msg: "Nhập đầy đủ hạng mục chi tiêu",
        });
      }

      const sliceRemaining = content.slice(
        mention.position,
        category.value.length + category.position + 1
      );
      const remain = content.replace(sliceRemaining, "").trim();
      let money;
      let note = "";

      const firstSpaceIndex = remain.indexOf(" ");
      if (firstSpaceIndex === -1) {
        money = convertStringToNumber(remain);
        note = "";
      } else {
        money = convertStringToNumber(remain.substring(0, firstSpaceIndex));
        note = remain.substring(firstSpaceIndex + 1);
      }

      if (!money) {
        return res.status(200).json({
          message: messageUpdated,
          msg: `Vui lòng nhập số tiền bạn ${mention.value} `,
        });
      }

      const remaining = await readRemaining(chat.sheetLink);
      if (mention.value === "chi tiêu" && remaining - money < 0) {
        return res.status(200).json({
          message: messageUpdated,
          msg: "Bạn đã chi tiêu vượt quá giới hạn. Bạn có thể chỉnh sửa tin nhắn trong 5 phút. Sau 5 phút thông tin sẽ được lưu vào file",
        });
      }
    }

    return res.status(200).json({ message: messageUpdated, msg: "Gửi tin nhắn thành công. Bạn có thể chỉnh sửa tin nhắn trong 5 phút. Sau 5 phút thông tin sẽ được lưu vào file" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server error" });
  }
});


module.exports = { allMessages, sendMessage, deleteMessage, updateMessage };
