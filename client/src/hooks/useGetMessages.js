import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import { toast } from "react-toastify";
import axios from "axios";
import { apiUrl } from "../../setupAxios";
import { useAuthContext } from "../Context/AuthContext";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const {authUser} = useAuthContext();
  

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        };
        const { data } = await axios.get(
          `${apiUrl}/api/message/${selectedConversation?._id}`,
          config
        );

        setMessages(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);

  return { messages, loading, setMessages };
};
export default useGetMessages;
