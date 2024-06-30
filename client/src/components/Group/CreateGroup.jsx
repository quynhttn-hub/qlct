import { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import UserBadgeItem from "./UserBadgeItem";
import UserListItem from "./UserListItem";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import { useAuthContext } from "../../Context/AuthContext";
import { apiUrl } from "../../../setupAxios";

export function CreateGroup() {
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

  const handleOpen = () => setOpen(!open);

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      setErrors({ ...errors, selectedUsers: "Người dùng đã được thêm" });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
    setErrors({ ...errors, selectedUsers: "" }); // Clear error message
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel.id !== delUser.id));
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


      const friends = data.filter(user => user.isFriend)
      setLoading(false);
      setSearchResult(friends);
    } catch (error) {
      toast.error("Failed to Load the Search Results", {
        position: "bottom-left",
      });
    }
  };

  const handleSubmit = async () => {
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

    // console.log(authUser);
    selectedUsers.push(authUser);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      };
      const { data } = await axios.post(
        `${apiUrl}/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u.id || u._id)),
          groupAdmin: authUser._id || authUser.id,
        },
        config
      );

      setChats([data, ...chats]);

      toast.success("Tạo nhóm thành công", {
        position: "top-center",
      });
      setSearchResult([]);
      setSelectedUsers([]);
      setOpen(false);
    } catch (error) {
      toast.error("Failed to Create the Chat!", {
        position: "bottom",
      });
    }
  };

  return (
    <>
      <button
        className="bg-gray-200 rounded-full p-2 hover:bg-gray-300"
        onClick={handleOpen}
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
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Tạo nhóm mới
            </Typography>
            <Typography className="-mb-2" variant="h6">
              Tên nhóm
            </Typography>
            <Input
              label="tên nhóm"
              size="lg"
              onChange={(e) => {
                setGroupChatName(e.target.value);
                setErrors({ ...errors, groupChatName: "" }); // Clear error message
              }}
              error={!!errors.groupChatName}
            />
            {errors.groupChatName && (
              <Typography color="red" variant="small">
                {errors.groupChatName}
              </Typography>
            )}

            <Typography className="-mb-2" variant="h6">
              Thành viên
            </Typography>
            <Input
              label="thành viên"
              size="lg"
              onChange={(e) => handleSearch(e.target.value)}
              error={errors.selectedUsers}
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
              Tạo
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}
