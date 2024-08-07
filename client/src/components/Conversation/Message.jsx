import React, { useEffect } from "react";
import clsx from "clsx";
import { Avatar } from "@material-tailwind/react";
import { format } from "date-fns";
import { useAuthContext } from "../../Context/AuthContext";
import EditInput from "./EditInput";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "../../../setupAxios";
import io from "socket.io-client";
const ENDPOINT = apiUrl;
var socket;

const Message = ({ m, messages, setMessages }) => {
  const { authUser } = useAuthContext();
  const isOwn = false;
  const container = clsx("flex gap-3 p-4 justify-start ");
  const avatar = clsx(isOwn && "order-2 ");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const [hover, setHover] = React.useState(false);

  const [edit, setEdit] = React.useState(false);

  const isMyMessage = authUser._id === m.sender._id;

  const messageOwn = clsx(
    "text-sm w-fit overflow-hidden",
    "bg-blue-100 text-gray",
    "rounded-full py-2 px-3"
  );

  const messageNotOwn = clsx(
    "text-sm w-fit overflow-hidden",
    "bg-gray-100",
    "rounded-full py-2 px-3"
  );

  const handlerEditMessage = async () => {
    setEdit((cur) => !cur);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", authUser);
  }, []);

  const handlerDeleteMessage = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${authUser.token}`,
      },
    };

    await axios
      .delete(`${apiUrl}/api/message/delete/${m._id}`, config)
      .then((res) => {
        const newMessages = messages.filter((message) => message._id !== m._id);
        setMessages(newMessages);
        socket.emit("delete message", m);
        
      })
      .catch((err) => {
        if (err.response && err.response.status === 403) {
          toast.error(
            "Bạn chỉ có thể xóa  tin nhắn trong vòng 5 phút kể từ khi gửi"
          );
        } else {
          console.error("There was an error editing the message!", err);
        }
      });
  };

  const [mess, setMess] = React.useState(m);
  const parts = [];
  let currentIndex = 0;
  const mention = mess.mention;
  const content = mess.content;
  const category = mess.category;

  if (mention) {
    if (mention.position > currentIndex) {
      parts.push(content.slice(currentIndex, mention.position));
    }

    parts.push(<span className="text-blue-600">@{mention.value}</span>);
    currentIndex = mention.position + mention.value.length + 1; // Update currentIndex correctly
  }

  if (category) {
    if (category.position > currentIndex) {
      parts.push(content.slice(currentIndex, category.position));
    }
    parts.push(
      <span className="text-gray-600 font-bold bg-blue-gray-100 rounded-full p-1 px-2 mx-2">
        /{category.value}
      </span>
    );
    currentIndex = category.position + category.value.length + 1; // Update currentIndex correctly
  }

  // Push any remaining text after the last mention
  if (currentIndex < content.length) {
    parts.push(content.slice(currentIndex));
  }

  return (
    <div
      className={container}
      onMouseEnter={isMyMessage ? () => setHover(true) : undefined}
      onMouseLeave={isMyMessage ? () => setHover(false) : undefined}
    >
      <div className={avatar}>
        <Avatar size="sm" src={m.sender.avatar} alt="avatar" />
      </div>

      {edit ? (
        // <input type="text" value={m.content} />
        <EditInput m={m} setEdit={setEdit} setMess={setMess} />
      ) : (
        <div className={body}>
          <div className="flex items-center gap-1">
            <div className="text-sm text-gray-500">{m.sender.username}</div>
            <div className="text-xs text-gray-400">
              {format(new Date(m.createdAt), "yyyy-MM-dd HH:mm")}
            </div>
          </div>
          <p
            className={
              authUser?._id == m.sender._id ? messageNotOwn : messageOwn
            }
          >
            {parts}
          </p>
        </div>
      )}

      {hover && (
        <div className="flex gap-2 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4 hover:text-blue-500 cursor-pointer"
            onClick={() => handlerEditMessage(m._id)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4 hover:text-red-500 cursor-pointer"
            onClick={() => handlerDeleteMessage(m._id)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Message;
