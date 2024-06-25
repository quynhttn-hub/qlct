import { useState } from "react";
import { toast } from "react-toastify";
import { useAuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../setupAxios";

const useSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async ({
    username,
    email,
    password,
    confirmPassword,
    avatar,
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
      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);
      navigate("/");
      toast.success("Đăng ký tài khoản thành công");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};
export default useSignup;
