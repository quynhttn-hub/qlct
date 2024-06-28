import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Badge,
  Avatar,
  Typography,
  Button,
  Tooltip,
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
// import { ChatState } from "../../Context/ChatProvider";
import "react-toastify/dist/ReactToastify.css";
import { ChatState } from "../../Context/ChatContext";
import { useAuthContext } from "../../Context/AuthContext";
import axios from "axios";
import EditGroup from "../Group/EditGroup";
import { apiUrl } from "../../../setupAxios";

const Header = ({ setOpen }) => {
  const { selectedChat } = ChatState();
  const { authUser } = useAuthContext();
  const [fileLink, setFileLink] = useState();
  const [loading, setLoading] = useState(false);
  const [spending, setSpending] = useState({ day: 0, week: 0, month: 0 });
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (selectedChat) {
      setFileLink(selectedChat?.sheetLink);
    }

    if (selectedChat?.groupAdmin?._id == authUser._id) {
      setEdit(true);
    }

  }, [selectedChat]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        };
        const { data } = await axios.get(
          `${apiUrl}/api/chat/spending/${selectedChat._id}`,
          config
        );
        if (data == 0) {
          setSpending({ day: 0, week: 0, month: 0 });
        } else {
          setSpending(data);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (selectedChat) {
      fetchData();
    }
  }, [selectedChat]);

  const handerCreateFile = async () => {
    setLoading(true);
    if (!selectedChat) {
      return;
    }
    const chatId = selectedChat._id;
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
      setFileLink(data.sheetLink);
      toast.success("Tạo file thành công");

      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        {selectedChat && authUser && (
        <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
          <div className="flex gap-3 items-center">
            <NavLink
              to={`/chats`}
              className={
                "lg:hidden block text-blue-gray-600 hover:text-blue-gray-800 transition cursor-pointer"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                />
              </svg>
            </NavLink>
            <Avatar
              src={
                selectedChat.isGroupChat
                  ? selectedChat.avatar
                  : selectedChat.users.length == 2
                  ? selectedChat.users[0]._id == authUser._id
                    ? selectedChat.users[1].avatar
                    : selectedChat.users[0].avatar
                  : null
              }
              alt="avatar"
            />
            <div className="flex flex-col">
              <Typography variant="h6">
                {selectedChat.chatName
                  ? selectedChat.chatName
                  : selectedChat.users[0].username === authUser.username
                  ? selectedChat.users[1].username
                  : selectedChat.users[0].username}
              </Typography>
            </div>


              {edit && (
              <EditGroup />
            )}

            {fileLink ? (
              <Link
                to={fileLink}
                target="_blank"
                className="underline italic font-semibold text-blue-500 cursor-pointer hover:text-blue-700 transition"
              >
                link file quản lý chi tiêu chung
              </Link>
            ) : (
              <Tooltip
                placement="bottom"
                className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
                content={
                  <div className="w-80">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal opacity-80"
                    >
                      File chung lưu trữ các thông tin về chi tiêu, kế hoạch chi
                      tiêu của các thành viên trong đoạn chat.
                    </Typography>
                  </div>
                }
              >
                <Button
                  color="green"
                  size="sm"
                  onClick={handerCreateFile}
                  loading={loading}
                >
                  <span className="text-sx">Tạo file Google Sheet mới</span>
                </Button>
              </Tooltip>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="orange"
              className="size-6"
            >
              <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z"
                clipRule="evenodd"
              />
            </svg>
            <Typography variant="h6" className="mr-2">
              Tổng chi tiêu:
            </Typography>
            <div className="flex gap-4">
                <Popover>
                <PopoverHandler>
                  <button className="hover:text-blue-500">Ngày</button>
                </PopoverHandler>
                <PopoverContent>
                  <div className="flex items-center">
                    <Typography variant="h6" className="mr-2">
                      Hôm nay:
                    </Typography>
                    <span className="mr-2 text-red-500">
                      {spending?.day?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </div>
                </PopoverContent>
              </Popover>  

                <Popover>
                <PopoverHandler>
                  <button className="hover:text-blue-500">Tuần</button>
                </PopoverHandler>
                <PopoverContent>
                  <div className="flex items-center">
                    <Typography variant="h6" className="mr-2">
                      Tuần này:
                    </Typography>
                    <span className="mr-2 text-red-500">
                      {spending?.week?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </div>
                </PopoverContent>
              </Popover>  

                <Popover>
                <PopoverHandler>
                  <button className="hover:text-blue-500">Tháng</button>
                </PopoverHandler>
                <PopoverContent>
                  <div className="flex items-center">
                    <Typography variant="h6" className="mr-2">
                      Tháng này:
                    </Typography>
                    <span className="mr-2 text-red-500">
                      {spending?.month?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </div>
                </PopoverContent>
              </Popover>  
              </div>  
            </div>  
            <div
            onClick={() => setOpen((cur) => !cur)}
            className="text-blue-500 cursor-pointer hover:text-blue-gray-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </div>  
          </div>  
        )}   
    </>
  );
};

export default Header;
