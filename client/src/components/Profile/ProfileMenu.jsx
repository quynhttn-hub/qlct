import React from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Avatar,
  Typography,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  PowerIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import { useAuthContext } from "../../Context/AuthContext";
import useLogout from "../../hooks/useLogout";
import ProfileDialog from "./ProfileDialog";
const profileMenuItems = [
  {
    label: "Trang cá nhân",
    icon: UserCircleIcon,
  },

  {
    label: "Đăng xuất",
    icon: PowerIcon,
  },
];

function ProfileMenu({setOpen}) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const { authUser } = useAuthContext();
    const { logout } = useLogout();

  return (
    <>
      <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
        <MenuHandler>
          <Button
            variant="text"
            color="blue-gray"
            className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 "
          >
            <Avatar
              variant="circular"
              size="sm"
              alt="tania andrew"
              className="border border-gray-900 p-0.5"
              src={authUser.avatar}
            />
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`h-3 w-3 transition-transform ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </MenuHandler>
        <MenuList className="p-1">
          {profileMenuItems.map(({ label, icon }, key) => {
            const isLastItem = key === profileMenuItems.length - 1;
            return (
              <MenuItem
                key={label}
                onClick={() => {
                  if (isLastItem) logout();
                  else setOpen(cur => !cur);
                }}
                className={`flex items-center gap-2 rounded ${
                  isLastItem
                    ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                    : ""
                }`}
              >
                {React.createElement(icon, {
                  className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                  strokeWidth: 2,
                })}
                <Typography
                  as="span"
                  variant="small"
                  className="font-normal"
                  color={isLastItem ? "red" : "inherit"}
                >
                  {label}
                </Typography>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </>
  );
}

export default ProfileMenu;
