import { useEffect } from "react";
import ScrollableFeed from "react-scrollable-feed";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "../../../setupAxios";
import { ChatState } from "../../Context/ChatProvider";
import { useAuthContext } from "../../Context/AuthContext";
import { useOurCategoriesContext } from "../../Context/useOurCategories";
import Message from "./Message";
import io from "socket.io-client";
const ENDPOINT = apiUrl;
var socket;

const MessageBox = () => {
  const { authUser } = useAuthContext();
  const { selectedChat } = ChatState();
  const { messages, setMessages } = useOurCategoriesContext();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", authUser);
  }, []);

  useEffect(() => {
    socket.on("delete message recieved", (message) => {
      const newMessages = messages.filter((m) => message._id !== m._id);
      setMessages(newMessages);
    });
  });

  useEffect(() => {
    const getMessages = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        };
        const { data } = await axios.get(
          `${apiUrl}/api/message/${selectedChat?._id}`,
          config
        );

        setMessages(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        // setLoading(false);
      }
    };

    if (selectedChat?._id) getMessages();
  }, [selectedChat?._id, setMessages]);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      };

      // setLoading(true);

      const { data } = await axios.get(
        `${apiUrl}/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      // setLoading(false);

      // socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!selectedChat) return;
    fetchMessages();

    // selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  return (
    <>
      {selectedChat ? (
        <ScrollableFeed>
          {messages &&
            messages.map((m) => {
              return (
                <Message
                  m={m}
                  key={m._id}
                  messages={messages}
                  setMessages={setMessages}
                />
              );
            })}
        </ScrollableFeed>
      ) : (
        <div className="h-full bg-white text-gray-500 p-6 rounded-lg shadow-lg flex items-center justify-center">
          <span className="text-2xl font-semibold">
            Chọn một đoạn chat để bắt đầu chat
          </span>
        </div>
      )}
    </>
  );
};

export default MessageBox;
