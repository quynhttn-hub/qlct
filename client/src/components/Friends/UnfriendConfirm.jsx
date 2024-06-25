import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuthContext } from "../../Context/AuthContext";
import { useFriendsContext } from "../../Context/useFriendsContext";
import { apiUrl } from "../../../setupAxios";
export function UnfriendConfirm({ setOpen, friend }) {
    const { authUser } = useAuthContext();
    const {setFriends} = useFriendsContext();

  const handlerUnFriend = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${authUser.token}`,
      },
      };
      
      await axios
        .post(
          `${apiUrl}/api/friend/unfiend`,
          { userId: authUser._id, friendId: friend._id || friend.id },
          config
        )
        .then((response) => {
            setOpen(false);
            setFriends((prev) => prev.filter((f) => f._id !== friend._id));
        })
        .catch((error) => {
          toast.error(error.message);
        });
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-xl font-semibold mb-4">Xác nhận hủy bạn bè</h2>
          <p className="mb-4">
            Bạn có chắc chắn hủy kết bạn với{" "}
            <span className="font-bold">{friend.username}</span>?
          </p>
          <div className="flex justify-end space-x-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setOpen(false)}
            >
              Hủy
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={handlerUnFriend}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
