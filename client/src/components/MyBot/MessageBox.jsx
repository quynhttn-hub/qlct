import { useEffect } from "react";
import ScrollableFeed from "react-scrollable-feed";
import useConversation from "../../zustand/useConversation";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import Message from "./Message";
import { toast } from "react-toastify";
import { apiUrl } from "../../../setupAxios";
import { useAuthContext } from "../../Context/AuthContext";


const MessageBox = () => {
  const { myChat } = ChatState();
  const { messages, setMessages } = useConversation();
  const {authUser } =useAuthContext();
  useEffect(() => {
    const getMessages = async () => {
      // setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        };
        const { data } = await axios.get(
          `${apiUrl}/api/message/${myChat?._id}`,
          config
        );

        setMessages(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        // setLoading(false);
      }
    };

    if (myChat?._id) getMessages();
  }, [myChat]);

  return (
    <>
      <ScrollableFeed>
        {messages &&
          messages.map((m) => {
            return <Message m={m} key={m._id} messages={messages} setMessages={setMessages} />;
          })}
      </ScrollableFeed>
    </>
  );
};

export default MessageBox;
