import { useEffect, useState } from "react";
import {
  Card,
  Typography,
  List,
  ListItemPrefix,
  Accordion,
  Button,
  Input,
} from "@material-tailwind/react";
import { InboxIcon } from "@heroicons/react/24/solid";
// import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { Link } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import { toast } from "react-toastify";
import { useCategoryContext } from "../../Context/MyCategoryContext";
import "../../assets/custom-scrollbar.css";
import { apiUrl } from "../../../setupAxios";
import { useAuthContext } from "../../Context/AuthContext";

export function Sidebar() {
  const { myChat, setMyChat } = ChatState();
  const [fileLink, setFileLink] = useState();
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState();
  const [incomeName, setIncomeName] = useState();
  // const [categories, setCategories] = useState([]);
  const { myCategory, setMyCategory, myIncome, setMyIncome } =
    useCategoryContext();
  const [visableClick, setVisableClick] = useState(true);
  const { authUser } = useAuthContext();



  useEffect(() => {
    setMyChat(authUser?.myChat);
  }, [authUser]);

  useEffect(() => {
    if (myChat) {
      setFileLink(myChat?.sheetLink);
    }
  }, [myChat]);

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
          setMyCategory(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [myChat]);

  useEffect(() => {
    if (myChat) {
      const config = {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      };

      axios
        .get(`${apiUrl}/api/income/${myChat?._id}`, config)
        .then((res) => {
          setMyIncome(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [myChat]);

  const handerCreateFile = async () => {
    setLoading(true);
    if (!myChat) {
      return;
    }
    const chatId = myChat._id;
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
      authUser.myChat = data.chat;
      localStorage.setItem("chat-user", JSON.stringify(authUser));
      setMyChat(data.chat);
      setFileLink(data.sheetLink);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      toast.success("Tạo file thành công");
    }
  };

  // if (!myChat) {
  //   return <div>Loading...</div>;
  // }

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
          { name: categoryName, chatId: myChat?._id },
          config
        )
        .then((res) => {
          setMyCategory([res.data, ...myCategory]);
          setVisableClick(true);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
          setVisableClick(true);
        });
    }
    setCategoryName("");
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
          { name: incomeName, chatId: myChat?._id },
          config
        )
        .then((res) => {
          setMyIncome([res.data, ...myIncome]);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }
    setIncomeName("");
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
        setMyCategory(myCategory.filter((item) => item._id !== id));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log(error);
      });
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
        setMyIncome(myIncome.filter((item) => item._id !== id));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log(error);
      });
  };

  return myChat ? (
    <Card className="w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        {fileLink ? (
          <Link
            to={fileLink}
            target="_blank"
            className="underline italic font-semibold text-blue-500 cursor-pointer hover:text-blue-700 transition"
          >
            link file quản lý chi tiêu
          </Link>
        ) : (
          <Button
            variant="gradient"
            color="green"
            onClick={handerCreateFile}
            loading={loading}
          >
            <span className="text-sx">Tạo file quản lý cá nhân</span>
          </Button>
        )}
      </div>

      {/* category */}
      <div className="flex flex-row justify-between items-center">
        <Typography variant="h6">Các hạng mục quản lý</Typography>
      </div>
      <div className="mb-2 pr-6 w-10 flex flex-row">
        <Input
          variant="static"
          placeholder="Thêm danh mục"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <button onClick={(e) => visableClick && handleCreateCategory(e)}>
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
      <List className="flex-1 overflow-y-auto pl-4 pr-4 custom-scrollbar">
        <Accordion>
          {myCategory.map((category) => (
            <div
              key={category._id || category.id}
              className="flex flex-row items-center h-10 px-3 rounded-lg"
            >
              <ListItemPrefix>
                <InboxIcon className="h-5 w-5" />
              </ListItemPrefix>

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
      <div className="flex flex-row justify-between items-center mt-3">
        <Typography variant="h6">Các loại thu nhập</Typography>
      </div>
      <div className="mb-2 pr-6 w-10 flex flex-row">
        <Input
          variant="static"
          placeholder="Thêm loại thu nhập"
          value={incomeName}
          onChange={(e) => setIncomeName(e.target.value)}
        />
        <button onClick={(e) => visableClick && handleCreateIncome(e)}>
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
      <List className="flex-1 overflow-y-auto pl-4 pr-4">
        <Accordion>
          {myIncome.map((income) => (
            <div
              key={income._id || income.id}
              className="flex flex-row items-center h-10 px-3 rounded-lg"
            >
              <ListItemPrefix>
                <InboxIcon className="h-5 w-5" />
              </ListItemPrefix>

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
    </Card>
  ) : (
    <div>Loading...</div>
  );
}
