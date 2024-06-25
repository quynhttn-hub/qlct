import { useState } from "react";
import { toast } from "react-toastify";
import { useAuthContext } from "../Context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../setupAxios";

const useLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async (email, password, setErrorLogin) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${apiUrl}/api/auth/login`,
        { email, password },
        config
      );
      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);
      navigate("/");
      toast.success("Đăng nhập thành công");
    } catch (error) {
      setErrorLogin("Tài khoản hoặc mật khẩu không hợp lệ");
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};
export default useLogin;
