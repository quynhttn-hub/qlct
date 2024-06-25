import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import { useCategoryContext } from "../../Context/MyCategoryContext";
import { toast } from "react-toastify";
import useConversation from "../../zustand/useConversation";
import { apiUrl } from "../../../setupAxios";
import { useAuthContext } from "../../Context/AuthContext";

const EditInput = ({ m, setEdit, setMess }) => {
  const { myChat } = ChatState();
  const { messages, setMessages } = useConversation();

  const {authUser} = useAuthContext();

  const { myCategory } = useCategoryContext();

  const [inputValue, setInputValue] = useState(m.content);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [trigger, setTrigger] = useState(null);
  const [mention, setMention] = useState(m.mention);
  const [category, setCategory] = useState(m.category);
  const [loading, setLoading] = useState(false);

  const [subcategories, setSubcategories] = useState([]);

  const categories = ["chi tiêu", "lập kế hoạch", "thu nhập"];

  // const subcategories = ["quần áo", "sức khỏe", "cafe"];

  useEffect(() => {
    if (myCategory) {
      const categoryNames = myCategory.map((category) => category.name);
      setSubcategories(categoryNames);
    }
  }, [myCategory]);

  useEffect(() => {
    const triggerChar = inputValue.match(/[@/][^@/]*$/);
    if (triggerChar) {
      const char = triggerChar[0][0];
      if (char === "@") {
        setSuggestions(categories);
        setShowSuggestions(true);
        setTrigger("@");
      } else if (char === "/") {
        setSuggestions(subcategories);
        setShowSuggestions(true);
        setTrigger("/");
      }
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue]);

  useEffect(() => {
    if (myChat) {
      const config = {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      };

      axios
        .get(`${apiUrl}/api/category/${myChat?._id}`, config)
        .then((res) => {
          const categoryNames = res.data.map((category) => category.name);
          setSubcategories(categoryNames);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [myChat]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setShowSuggestions(false);
    const cursorPosition = inputValue.search(/[@/][^@/]*$/);
    const newValue = inputValue.replace(
      /[@/][^@/]*$/,
      `${trigger}${suggestion} `
    );
    setInputValue(newValue);
    if (trigger === "@") {
      setMention({ value: suggestion, position: cursorPosition });
    } else if (trigger === "/") {
      setCategory({ value: suggestion, position: cursorPosition });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default behavior of Enter key
      handleSubmit();
      setInputValue(""); // Call your function to handle data submission
      setMention(null);
      setCategory(null);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      };

      console.log(mention, category, inputValue);

      const { data } = await axios.put(
        `${apiUrl}/api/message/update/${m._id}`,
        {
          mention: mention,
          category: category,
          content: inputValue,
          //   chatId: myChat?._id,
        },
        config
      );

      //   setMessages([...messages, data]);
      // console.log(data.mention);
      setMess(data.message);
      setEdit(false);
      toast.success("Message sent successfully");
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error(
          "Bạn chỉ có thể sửa tin nhắn trong vòng 5 phút kể từ khi gửi"
        );
      } else {
        console.error("There was an error editing the message!", error);
      }
    }
    setLoading(false);
  };

  return (
    <div className="w-full mx-auto border rounded-lg shadow-md bg-white">
      {showSuggestions && (
        <ul
          //   role="menu"
          //   data-popover="menu"
          data-popover-placement="top"
          className=" z-10 overflow-auto rounded-md border border-blue-gray-50 bg-white p-3 font-sans text-sm font-normal text-blue-gray-800 shadow-lg shadow-blue-gray-500/10 focus:outline-none"
        >
          {suggestions.map((suggestion, index) => (
            <li
              role="menuitem"
              className="block w-full cursor-pointer select-none rounded-md px-3 pt-[9px] pb-2 text-start leading-tight transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      <div className="relative w-full mb-2">
        <input
          className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Gõ @ để gọi chi tiêu/lập kế hoạch/thu nhập, gõ / để gọi hạng mục/loại thu nhập"
        />
        {loading && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="text-gray-300 animate-spin"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
            >
              <path
                d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-900"
              ></path>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditInput;
