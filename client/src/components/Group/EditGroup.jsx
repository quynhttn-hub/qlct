import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Tooltip,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import UserBadgeItem from "./UserBadgeItem";
import UserListItem from "./UserListItem";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import { useAuthContext } from "../../Context/AuthContext";
import { apiUrl } from "../../../setupAxios";

const EditGroup = () => {
  const { selectedChat, setSelectedChat } = ChatState();
  const { chats, setChats } = ChatState();
  const { authUser } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupChatName, setGroupChatName] = useState("");
  const [errors, setErrors] = useState({
    groupChatName: "",
    selectedUsers: "",
  });

  useEffect(() => {
    setGroupChatName(selectedChat.chatName);
    setSelectedUsers(selectedChat.users.filter((u) => u._id !== authUser._id));
  }, [selectedChat, authUser]);

  const handleOpen = () => setOpen(!open);

  const handleGroup = (userToAdd) => {
    console.log(selectedUsers, userToAdd);
    if (
      selectedUsers.find((u) => u._id === userToAdd.id || u.id === userToAdd.id)
    ) {
      setErrors({ ...errors, selectedUsers: "Người dùng đã được thêm" });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
    setErrors({ ...errors, selectedUsers: "" }); // Clear error message
  };

  const handleDelete = (delUser) => {
    //   console.log(delUser);
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSearch = async (query) => {
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      };
      const { data } = await axios.get(
        `${apiUrl}/api/user/${authUser._id}?search=${query}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to Load the Search Results", {
        position: "bottom-left",
      });
    }
  };

  const handleSubmit = async () => {
    console.log(selectedUsers, groupChatName);
    let hasError = false;
    let tempErrors = { groupChatName: "", selectedUsers: "" };

    if (!groupChatName) {
      tempErrors.groupChatName = "Tên nhóm là bắt buộc";
      hasError = true;
    }

    if (selectedUsers.length < 2) {
      tempErrors.selectedUsers = "Nhóm phải có ít nhất 2 thành viên";
      hasError = true;
    }

    setErrors(tempErrors);

    if (hasError) return;

    // // console.log(authUser);

    const newUsers = selectedUsers;
    newUsers.push(authUser);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      };
      const { data } = await axios.post(
        `${apiUrl}/api/chat/edit`,
        {
          chatId: selectedChat._id,
          newName: groupChatName,
          newUsers: JSON.stringify(newUsers.map((u) => u.id || u._id)),
          //   groupAdmin: authUser._id || authUser.id,
        },
        config
      );

      console.log(data);
      setSelectedChat(data);

      setChats(
        chats.map((chat) => {
          if (chat._id === selectedChat._id) {
            return data;
          } else {
            return chat;
          }
        })
      );

      toast.success("Chỉnh sửa nhóm thành công", {
        position: "top-center",
      });
      setOpen(false);
    } catch (error) {
      toast.error("Failed to Create the Chat!", {
        position: "bottom",
      });
    }
  };
  /// commit linh tinh
  return (
    <>
      <Tooltip
        placement="bottom"
        className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
        content={
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal opacity-80"
            >
              Sửa nhóm
            </Typography>
          </div>
        }
      >
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
            onClick={handleOpen}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </button>
      </Tooltip>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Nhóm
            </Typography>
            <Typography className="-mb-2" variant="h6">
              Tên nhóm
            </Typography>
            <Input
              value={groupChatName}
              label="tên nhóm"
              size="lg"
              onChange={(e) => {
                setGroupChatName(e.target.value);
              }}
              error={!!errors.groupChatName}
            />

            <Typography className="-mb-2" variant="h6">
              Thành viên
            </Typography>
            <Input
              label="thành viên"
              size="lg"
              onChange={(e) => handleSearch(e.target.value)}
              error={!!errors.selectedUsers}
            />
            {errors.selectedUsers && (
              <Typography color="red" variant="small">
                {errors.selectedUsers}
              </Typography>
            )}

            <div className="flex flex-row gap-1">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u.id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </div>

            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user.id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </CardBody>
          <CardFooter className="pt-0">
            <Button className="bg-blue-800" onClick={handleSubmit} fullWidth>
              Cập nhật
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
};

export default EditGroup;
