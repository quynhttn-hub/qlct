import { useState } from "react";
import { useAuthContext } from "../Context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../setupAxios";

const useLogout = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const logout = async () => {
		setLoading(true);
		try {
			const config = {
				headers: {
					"Content-type": "application/json",
				},
			};
			await axios.post(`${apiUrl}/api/auth/logout`, config);

			localStorage.removeItem("chat-user");
			setAuthUser(null);
			navigate("/")
		} catch (error) {
			toast.error(error.message);

		} finally {
			setLoading(false);
		}
	};

	return { loading, logout };
};
export default useLogout;
