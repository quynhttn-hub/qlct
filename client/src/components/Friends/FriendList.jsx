import React, { useState } from "react";
import { Avatar, Typography } from "@material-tailwind/react";
import { useFriendsContext } from "../../Context/useFriendsContext";
import { useAuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import { toast } from "react-toastify";
import { UnfriendConfirm } from "./UnfriendConfirm";
import { apiUrl } from "../../../setupAxios";

const FriendList = () => {
  const { friends } = useFriendsContext();
  const { authUser } = useAuthContext();
  const { setSelectedChat } = ChatState();
  const [open, setOpen] = React.useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleUnfriendClick = (friend) => {
    setSelectedFriend(friend);
    setOpen(true);
  };

  const handleSelectedChat = async (friend) => {
    if (!friend) return;
    const config = {
      headers: {
        Authorization: `Bearer ${authUser.token}`,
      },
    };

    await axios
      .post(
        `${apiUrl}/api/chat`,
        { myId: authUser._id, userId: friend.id || friend._id },
        config
      )
      .then((response) => {
        setSelectedChat(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <>
      <div className="h-1/2 justify-center pt-3">
        <Typography variant="h5" color="blue-gray">
          Bạn bè
        </Typography>
        {friends && friends.length > 0 ? (
          friends.map((friend) => (
            <div key={friend.id || friend._id}>
              <div
                // onClick={() => handleSelectedChat(friend)}
                className="flex items-center gap-3 p-2 hover:bg-blue-gray-50 rounded-lg"
              >
                <Avatar
                  src={friend.avatar}
                  alt="avatar"
                  className="w-10 h-10"
                />
                <Typography className="ml-2">{friend.username}</Typography>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 hover:text-blue-500 cursor-pointer"
                  //todo
                  onClick={() => handleSelectedChat(friend)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 hover:text-red-500 cursor-pointer"
                  onClick={() => handleUnfriendClick(friend)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                  />
                </svg>
              </div>
              {open && (
                <UnfriendConfirm
                  setOpen={setOpen}
                  open={open}
                  friend={selectedFriend}
                />
              )}
            </div>
          ))
        ) : (
          <span className="text-gray-500 pt-3">Chưa có bạn bè</span>
        )}
      </div>
    </>
  );
};

export default FriendList;
