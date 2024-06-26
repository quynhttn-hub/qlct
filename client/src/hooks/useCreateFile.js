import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import useGetMySelfChat from "../hooks/useGetMySelfChat";
import { apiUrl } from "../../setupAxios";
import { useAuthContext } from "../Context/AuthContext";

const useCreateFile = () => {
  const [loading, setLoading] = useState(false);

  const { chat, setChat } = useGetMySelfChat();

  const { authUser } = useAuthContext();

  const createFile = async ({ chatId, setFileLink }) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      };

      const { data } = await axios.post(
        `${apiUrl}/api/chat/createfile`,
        { chatId },
        config
      );
      // setChat({...chat, sheetId: data.sheetId});
      setFileLink(data.sheetLink)
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      // toast.success("thanh cong")
    }
  };

  return { loading, createFile };
};
export default useCreateFile;
