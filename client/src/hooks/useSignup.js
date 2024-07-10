import { useState } from "react";
import { toast } from "react-toastify";
import { useAuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../setupAxios";
import { ChatState } from "../Context/ChatProvider";

const useSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  const { setMyChat } = ChatState();

  const signup = async ({
    username,
    email,
    password,
    confirmPassword,
    avatar,
    setVerifiError
  }) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${apiUrl}/api/auth/signup`,
        {
          username,
          email,
          password,
          confirmPassword,
          avatar,
        },
        config
      );

      console.log(data);

      setMyChat(data.myChat);
      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);
      navigate("/");
      toast.success("Đăng ký tài khoản thành công");
    } catch (error) {
      setVerifiError(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};
export default useSignup;
