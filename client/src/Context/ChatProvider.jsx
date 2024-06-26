import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "../Context/AuthContext";
import axios from "axios";
import { apiUrl } from "../../setupAxios";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const [myChat, setMyChat] = useState(null);
  const { authUser } = useAuthContext();

  console.log(authUser);


  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        notification,
        setNotification,
        chats,
        setChats,
        myChat,
        setMyChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
