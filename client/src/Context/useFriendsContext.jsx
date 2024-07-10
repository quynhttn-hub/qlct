// UserContext.js
import  { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "./AuthContext";
import { apiUrl } from "../../setupAxios";

const FriendsContext = createContext();

export const useFriendsContext = () => {
  return useContext(FriendsContext);
};

export const FriendsProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const { authUser } = useAuthContext();
  
  console.log(authUser);

  useEffect(() => {
    if (!authUser) return;

    const fetchData = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      };

      await axios
        .get(`${apiUrl}/api/friend/get/${authUser._id}`, config)
        .then((response) => {
          setFriends(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();
  }, [authUser]);

  return (
    <FriendsContext.Provider value={{ friends, setFriends }}>
      {children}
    </FriendsContext.Provider>
  );
};
