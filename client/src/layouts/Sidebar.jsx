import { useState, useEffect } from "react";
import {
  Typography,
  ListItem,
  ListItemPrefix,
  Input,
  Badge,
  Avatar,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { CreateGroup } from "../components/Group/CreateGroup";
import { ChatState } from "../Context/ChatProvider";
import { toast } from "react-toastify";
import ChatLoading from "../components/Sketeton/ChatLoading";
import axios from "axios";
import { useAuthContext } from "../Context/AuthContext";
import { io } from "socket.io-client";
import { apiUrl } from "../../setupAxios";

var socket;
const ENDPOINT = apiUrl;

function Sidebar() {
  const { authUser } = useAuthContext();
  const [searchResult, setSearchResult] = useState([]);
  const { setSelectedChat, chats, setChats } = ChatState();
  const [search, setSearch] = useState("");

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", authUser);
  }, [authUser]);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      };

      const { data } = await axios.get(`${apiUrl}/api/chat/${authUser._id}`, config);
      setChats(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (authUser) {
      fetchChats();
    }
  }, [authUser]);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      // setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      };
      const { data } = await axios.get(
        `${apiUrl}/api/user/${authUser._id}?search=${query}`,
        config
      );
      // setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSetSearchResult = async (selectedUser) => {
    setSearch("");
    setSearchResult([]);
  };

  const handleSendRequestFriend = async (selectedUser) => {
    const userId = selectedUser.id;
    const authId = authUser._id;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      };
      const { data } = await axios.post(
        `${apiUrl}/api/friend/request`,
        { authId, userId },
        config
      );
      socket.emit("new notification", {
        sendId: userId,
        id: authId,
        username: authUser.username,
        avatar: authUser.avatar,
      });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="h-1/6 flex items-center gap-4 pl-4 pr-4 justify-between">
        <Typography variant="h5" color="blue-gray">
          Đoạn chat
        </Typography>
        <CreateGroup />
      </div>
      <div className="pl-4 pr-4 flex flex-col">
        <Input
          icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          label="Tìm kiếm"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <hr className="mt-2 my-2 border-blue-gray-50" />
      </div>
      {searchResult.length > 0 && (
        <div className="flex-1 overflow-y-auto pl-4 pr-4">
          {searchResult.map((user) => (
            <div
              key={user._id || user.id}
              onClick={() => handleSetSearchResult(user)}
              cursor="pointer"
            >
              <div className="hover:bg-blue-gray-50 cursor-pointer p-4 rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar src={user.avatar} alt="avatar" />
                  <div>
                    <Typography variant="h6">{user.username}</Typography>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                    >
                      {`${user.email.substring(0, 15)}...`}
                    </Typography>
                    {user.isFriend ? (
                      <span>Bạn bè</span>
                    ) : user.sentRequest ? (
                      <span className="text-xs bg-orange-500 text-white font-bold py-1 px-2 rounded">
                        Đang yêu cầu
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSendRequestFriend(user)}
                        className="text-xs bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Kết bạn
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {chats.length > 0 ? (
        <div className="flex-1 overflow-y-auto pl-4 pr-4">
          {chats.map((chat) => {
            if (chat.users.length != 1)
              return (
                <ListItem
                  key={chat._id || chat.id}
                  onClick={() => {
                    setSelectedChat(chat);
                  }}
                  cursor="pointer"
                >
                  <ListItemPrefix>
                    <div className="flex items-center gap-4">
                      <Avatar
                        src={
                          chat.isGroupChat
                            ? chat.avatar
                            : chat.users.length == 2
                            ? chat.users[0]._id == authUser._id
                              ? chat.users[1].avatar
                              : chat.users[0].avatar
                            : null
                        }
                        alt="avatar"
                      />
                      <div>
                        <Typography variant="h6">{chat.chatName}</Typography>
                        {chat.latestMessage && (
                          <Typography
                            variant="small"
                            color="gray"
                            className="font-normal"
                          >
                            <b>{chat.latestMessage.sender.name} : </b>
                            {chat.latestMessage.content.length > 50
                              ? chat.latestMessage.content.substring(0, 51) +
                                "..."
                              : chat.latestMessage.content}
                          </Typography>
                        )}
                      </div>
                     
                    </div>
                  </ListItemPrefix>
                </ListItem>
              );
          })}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pl-4 pr-4">
          <ChatLoading />
        </div>
      )}
    </div>
  );
}

export default Sidebar;
