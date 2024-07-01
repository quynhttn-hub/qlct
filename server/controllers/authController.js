const User = require("../models/userModel");
const generateToken = require("../config/generateTokenOld");
const Chat = require("../models/chatModel");

const signup = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, avatar } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Mật khẩu không trùng khớp" });
    }

    let user;
    user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "Email đã tồn tại" });
    }

    user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ error: "Tài khoản đã tồn tại" });
    }

    let data;
    if (avatar) {
      data = {
        username,
        email,
        password,
        avatar,
      };
    } else {
      data = {
        username,
        email,
        password,
      };
    }

    const newUser = new User(data);

    if (newUser) {
      await newUser.save();
      // create chat to myself

      const userId = newUser._id;
      const chat = await Chat.find({
        users: { $size: 1, $elemMatch: { $eq: userId } },
      });
      // nếu không có chat thì tạo chat
      let newChat;
      if (chat.length == 0) {
        newChat = await Chat.create({
          chatName: "My Self Chat",
          users: [userId],
          isGroupChat: false,
        });
      } else {
        newChat = chat[0];
      }

      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        avatar: newUser.avatar,
        email: newUser.email,
        token: generateToken(newUser._id),
        myChat: newChat,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    // const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      avatar: user.avatar,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { signup, login, logout };
