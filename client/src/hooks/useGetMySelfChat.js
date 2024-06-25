import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuthContext } from "../Context/AuthContext";
import axios from "axios";
import useConversation from "../zustand/useConversation";

import { apiUrl } from "../../setupAxios";

const useGetMySelfChat = () => {
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([]);
  const { authUser } = useAuthContext();
  const { setFile, setSelectedConversation } = useConversation();

  useEffect(() => {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${authUser.token}`,
      },
    };

    axios
      .get(`${apiUrl}/api/chat/myself/${authUser._id}`, config)
      .then((res) => {
        setChat(res.data[0]);
        setSelectedConversation(res.data[0]);
        if (res.data[0].sheetId) {
          setFile(res.data[0].sheetId);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { loading, chat };
};
export default useGetMySelfChat;
