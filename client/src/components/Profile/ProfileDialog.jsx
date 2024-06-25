import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { apiUrl } from "../../../setupAxios";

const ProfileDialog = ({ setOpen }) => {
  const { authUser, setAuthUser } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [picLoading, setPicLoading] = useState(false);
  const [picError, setPicError] = useState("");

  const [notCurrentPasswordError, setNotCurrentPasswordError] = useState();

  useEffect(() => {
    if (authUser) {
      setEmail(authUser.email);
      setAvatar(authUser.avatar);
      setUsername(authUser.username);
    }
  }, [authUser]);

  const postDetails = (pics) => {
    setPicLoading(true);
    setPicError("");

    if (!pics) {
      setPicError("No image selected");
      setPicLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "piyushproj");

      fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setAvatar(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setPicError("Error uploading image");
          setPicLoading(false);
        });
    } else {
      setPicError("Please select a JPEG or PNG image");
      setPicLoading(false);
    }
  };

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleCurrentPasswordChange = (e) => setCurrentPassword(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);

  const handleEditProfile = async () => {
    if (!email || !username) {
      alert("Email and Username are required");
      return;
    }

    if (newPassword && !currentPassword) {
      alert("Current password is required to set a new password");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      };

      const { data } = await axios.post(
        `${apiUrl}/api/user/update`,
        {
          id: authUser._id,
          email,
          avatar,
          username,
          currentPassword,
          newPassword,
        },
        config
      );

      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);
      setAvatar(data.avatar);
      setEmail(data.email);
      setUsername(data.username);
      setCurrentPassword("");
      setNewPassword("");
      setIsEditing(false);
    } catch (error) {
      if (error.response.status === 401) {
        setNotCurrentPasswordError("Mật khẩu hiện tại không đúng");
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Profile</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 ml-auto hover:cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div className="flex items-center mb-4">
          <div className="relative">
            <img
              src={avatar}
              alt="User Avatar"
              className="w-16 h-16 rounded-full mr-4 object-cover"
            />
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                className="absolute top-0 left-0 w-16 h-16 opacity-0 cursor-pointer"
                onChange={(e) => postDetails(e.target.files[0])}
              />
            )}
          </div>
          <div>
            <p className="font-bold">{username}</p>
            <p className="text-gray-500">{email}</p>
          </div>
        </div>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
        {isEditing && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username:
            </label>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              className="block w-full px-3 py-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="block w-full px-3 py-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu hiện tại: <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
              className="block w-full px-3 py-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {notCurrentPasswordError && (
              <p className="text-red-500 text-sm mt-2 mb-2">
                {notCurrentPasswordError}
              </p>
            )}
            <label className="block text-sm font-medium text-gray-700 mb-1">
             Mật khẩu mới:
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              className="block w-full px-3 py-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        )}
        {isEditing && (
          <button
            onClick={handleEditProfile}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            disabled={picLoading}
          >
            {picLoading ? "Loading..." : "Lưu"}
          </button>
        )}
        {picError && <p className="text-red-500 text-sm mt-2">{picError}</p>}
      </div>
    </div>
  );
};

export default ProfileDialog;
