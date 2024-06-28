import { useState, useEffect } from "react";
import { Avatar, Typography } from "@material-tailwind/react";
import { useAuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { useFriendsContext } from "../../Context/useFriendsContext";
import { apiUrl } from "../../../setupAxios";

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const { authUser } = useAuthContext();
  const { friends, setFriends } = useFriendsContext();

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
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();
  }, [friends]);

  const handleAcceptRequest = async (requestId) => {
    const accepterId = authUser._id;
    const userId = requestId;
    const config = {
      headers: {
        Authorization: `Bearer ${authUser.token}`,
      },
    };
    await axios
      .post(
        `${apiUrl}/api/friend/accept`,
        {
          userId,
          accepterId,
        },
        config
      )
      .then((response) => {
        setFriends(response.data.friends);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancelRequest = async (requestId) => {
    const userId = authUser._id;
    const friendId = requestId;
    const config = {
      headers: {
        Authorization: `Bearer ${authUser.token}`,
      },
    };
    await axios
      .post(
        `${apiUrl}/api/friend/cancelFriendRequest`,
        {
          userId,
          friendId,
        },
        config
      )
      .then((response) => {
        setRequests(requests.filter((request) => request.id !== requestId));
        // setFriends(response.data.friends);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="h-1/2 justify-center pt-3">
        <Typography variant="h5" color="blue-gray">
          Lời mời kết bạn
        </Typography>
        <div className="overflow-y-auto">
          {requests && requests.length > 0 ? (
            requests.map((request) => (
              <div key={request.id} className="flex items-center gap-3 p-2">
                <Avatar src={request.avatar} className="w-10 h-10" />
                <Typography className="ml-2">{request.username}</Typography>
                <button
                  onClick={() => handleAcceptRequest(request.id)}
                  className="ml-2 text-xs bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded"
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
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                </button>

                <button
                  className="hover:text-red-500"
                  onClick={() => handleCancelRequest(request.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <span className="text-gray-500 pt-3">Không có lời mời kết bạn</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestList;
