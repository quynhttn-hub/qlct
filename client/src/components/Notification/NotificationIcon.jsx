import React, { useState, useEffect } from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
  Avatar,
  Typography,
} from "@material-tailwind/react";
import { useAuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import io from "socket.io-client";
import { apiUrl } from "../../../setupAxios";

const ENDPOINT = apiUrl; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

function ClockIcon() {
  return (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.99998 14.9C9.69736 14.9 11.3252 14.2257 12.5255 13.0255C13.7257 11.8252 14.4 10.1974 14.4 8.49998C14.4 6.80259 13.7257 5.17472 12.5255 3.97449C11.3252 2.77426 9.69736 2.09998 7.99998 2.09998C6.30259 2.09998 4.67472 2.77426 3.47449 3.97449C2.27426 5.17472 1.59998 6.80259 1.59998 8.49998C1.59998 10.1974 2.27426 11.8252 3.47449 13.0255C4.67472 14.2257 6.30259 14.9 7.99998 14.9ZM8.79998 5.29998C8.79998 5.0878 8.71569 4.88432 8.56566 4.73429C8.41563 4.58426 8.21215 4.49998 7.99998 4.49998C7.7878 4.49998 7.58432 4.58426 7.43429 4.73429C7.28426 4.88432 7.19998 5.0878 7.19998 5.29998V8.49998C7.20002 8.71213 7.28434 8.91558 7.43438 9.06558L9.69678 11.3288C9.7711 11.4031 9.85934 11.4621 9.95646 11.5023C10.0536 11.5425 10.1577 11.5632 10.2628 11.5632C10.3679 11.5632 10.472 11.5425 10.5691 11.5023C10.6662 11.4621 10.7544 11.4031 10.8288 11.3288C10.9031 11.2544 10.9621 11.1662 11.0023 11.0691C11.0425 10.972 11.0632 10.8679 11.0632 10.7628C11.0632 10.6577 11.0425 10.5536 11.0023 10.4565C10.9621 10.3593 10.9031 10.2711 10.8288 10.1968L8.79998 8.16878V5.29998Z"
        fill="#90A4AE"
      />
    </svg>
  );
}

export function NotificationIcon() {
  const navigate = useNavigate();
  const { authUser } = useAuthContext();
  const [requests, setRequests] = useState([]);
  const { notification, setNotification } = ChatState();


  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", authUser);
  }, [authUser]);

  useEffect(() => {
    socket.on("notification recieved", (newNotificationRecieved) => {
      setRequests([newNotificationRecieved, ...requests]);
    });
  }, [socket]);

  useEffect(() => {
    if (!authUser) return;
    const fetchData = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      };
      await axios
        .get(`${apiUrl}/api/friend/getrequest/${authUser._id}`, config)
        .then((response) => {
          setRequests(response.data);
          setNotification([...response.data, ...notification]);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();
  }, [authUser]);

  const handleClickNoti = (request) => {
    //delete request

    setRequests(requests.filter((r) => r._id !== request._id));
    navigate("/chats");
    // console.log("hi em");
    // navigate("/notifications");
  };
  return (
    <Menu>
      <MenuHandler>
        <IconButton variant="text" className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
              clipRule="evenodd"
            />
          </svg>
          <div className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 text-xs text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
            {requests.length}
          </div>
        </IconButton>
      </MenuHandler>
      <MenuList
        className="flex flex-col gap-2"
        
      >
        {requests && requests.length > 0 ? (
          requests.map((request) => (
            <MenuItem
              className="flex items-center gap-4 py-2 pl-2 pr-8"
              key={request._id}
              onClick={() => handleClickNoti(request)}
            >
              <Avatar
                variant="circular"
                alt="tania andrew"
                src={request.avatar}
              />
              <div className="flex flex-col gap-1">
                <div>
                  <span className="font-semibold">{request.username} </span>
                  <span className="">đã gửi lời mời kết bạn.</span>
                </div>
                <Typography className="flex items-center gap-1 text-sm font-medium text-blue-gray-500">
                  <ClockIcon />
                  13 minutes ago
                </Typography>
              </div>
            </MenuItem>
          ))
        ) : (
          <span>Không có thông báo</span>
        )}
      </MenuList>
    </Menu>
  );
}
