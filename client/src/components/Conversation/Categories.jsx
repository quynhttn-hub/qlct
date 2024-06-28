import { useState, useEffect } from "react";
import { Typography, Input, List, Accordion } from "@material-tailwind/react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import { toast } from "react-toastify";
import { useOurCategoriesContext } from "../../Context/useOurCategories";
import ListMembers from "./ListMembers";
import { apiUrl } from "../../../setupAxios";
import { useAuthContext } from "../../Context/AuthContext";

export const Categories = () => {
  const { selectedChat } = ChatState();
  const { ourCategories, setOurCategories, ourIncomes, setOurIncomes } =
    useOurCategoriesContext();
  const [visableClick, setVisableClick] = useState(true);
  const [categoryName, setCategoryName] = useState();
  const [incomeName, setIncomeName] = useState();
  const [members, setMembers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (selectedChat) {
      setMembers(selectedChat.users);
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

  const handleCreateCategory = (e) => {
    e.preventDefault();
    setVisableClick(false);
    if (categoryName) {
      const config = {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      };
      axios
        .post(
          `${apiUrl}/api/category/create`,
          { name: categoryName, chatId: selectedChat?._id },
          config
        )
        .then((res) => {
          setOurCategories([res.data, ...ourCategories]);
          setCategoryName("");
          setVisableClick(true);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
          setVisableClick(true);
        });
    }
  };

  const handleDeleteCategory = (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${authUser.token}`,
      },
    };
    axios
      .delete(`${apiUrl}/api/category/delete/${id}`, config)
      .then((res) => {
        setOurCategories(ourCategories.filter((item) => item._id !== id));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log(error);
      });
  };

  const handleCreateIncome = (e) => {
    e.preventDefault();
    if (incomeName) {
      const config = {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      };
      axios
        .post(
          `${apiUrl}/api/income/create`,
          { name: incomeName, chatId: selectedChat?._id },
          config
        )
        .then((res) => {
          setOurIncomes([res.data, ...ourIncomes]);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }
    setIncomeName("");
  };

  const handleDeleteIncome = (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${authUser.token}`,
      },
    };
    axios
      .delete(`${apiUrl}/api/income/delete/${id}`, config)
      .then((res) => {
        setOurIncomes(ourIncomes.filter((item) => item._id !== id));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log(error);
      });
  };
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <Typography variant="h6" className="p-3">
        Các hạng mục quản lý
      </Typography>
      <div className="mb-2 flex flex-row px-3">
        <Input
          variant="static"
          placeholder="Thêm hạng mục"
          value={incomeName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <button
          onClick={(e) => {
            handleCreateCategory(e);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={
              visableClick ? "size-6 text-green-700" : "size-6 text-green-100"
            }
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
      </div>
      <List className="flex-1 overflow-y-auto pl-4 pr-4 ">
        <Accordion>
          {ourCategories.map((category) => (
            <div
              key={category._id}
              className="flex flex-row items-center h-10  px-3 rounded-lg"
            >
              <div className="flex-grow">{category.name}</div>

              <button
                className="text-red-500 ml-auto"
                onClick={() => handleDeleteCategory(category._id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </button>
            </div>
          ))}
        </Accordion>
      </List>

      {/* income */}
      <Typography variant="h6" className="p-3">
        Các loại thu nhập
      </Typography>
      <div className="mb-2 flex flex-row px-3">
        <Input
          variant="static"
          placeholder="Thêm loại thu nhập"
          value={incomeName}
          onChange={(e) => setIncomeName(e.target.value)}
        />
        <button
          onClick={(e) => {
            handleCreateIncome(e);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={
              visableClick ? "size-6 text-green-700" : "size-6 text-green-100"
            }
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
      </div>
      <List className="flex-1 overflow-y-auto pl-4 pr-4 ">
        <Accordion>
          {ourIncomes.map((income) => (
            <div
              key={income._id}
              className="flex flex-row items-center h-10  px-3 rounded-lg"
            >
              <div className="flex-grow">{income.name}</div>

              <button
                className="text-red-500 ml-auto"
                onClick={() => handleDeleteIncome(income._id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </button>
            </div>
          ))}
        </Accordion>
      </List>
      {selectedChat.isGroupChat && <ListMembers members={members} />}
    </div>
  );
};
