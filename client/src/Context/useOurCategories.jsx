import  { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { ChatState } from "./ChatProvider";
import { apiUrl } from "../../setupAxios";
import { useAuthContext } from "./AuthContext";

const OurCategoriesContext = createContext();

export const useOurCategoriesContext = () => {
  return useContext(OurCategoriesContext);
};

export const OurCategoriesProvider = ({ children }) => {
  const [ourCategories, setOurCategories] = useState([]);
  const [ourIncomes, setOurIncomes] = useState([]);
  const [messages, setMessages] = useState([]);
  const { selectedChat } = ChatState();
  const { authUser } = useAuthContext();

 useEffect(() => {
   if (selectedChat) {
     const config = {
       headers: {
         Authorization: `Bearer ${authUser.token}`,
       },
     };

     axios
       .get(`${apiUrl}/api/category/${selectedChat?._id}`, config)
       .then((res) => {
         setOurCategories(res.data);
       })
       .catch((error) => {
         console.log(error);
       });
   }
 }, [selectedChat]);
  
  useEffect(() => {
    if (selectedChat) {
      const config = {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      };

      axios
        .get(`${apiUrl}/api/income/${selectedChat?._id}`, config)
        .then((res) => {
          setOurIncomes(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [selectedChat]);

  return (
    <OurCategoriesContext.Provider
      value={{
        ourCategories,
        setOurCategories,
        messages,
        setMessages,
        ourIncomes,
        setOurIncomes,
      }}
    >
      {children}
    </OurCategoriesContext.Provider>
  );
};
