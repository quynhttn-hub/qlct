import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { NavLink } from "react-router-dom";
// import { ChatState } from "../Context/ChatProvider";
import ProfileMenu from "../components/Profile/ProfileMenu";
import {NotificationIcon} from "../components/Notification/NotificationIcon";
import { useAuthContext } from "../Context/AuthContext";

function Header({setOpen}) {
  const { authUser } = useAuthContext();
  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className="w-[40rem] mt-2 mb-4 flex flex-col gap-2 justify-center lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <NavLink to={`/`}>
        <Typography
          as="li"
          variant="paragraph"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium text-blue-gray-700 hover:text-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              fill="#334155"
            />
          </svg>
          Trang chủ
        </Typography>
      </NavLink>

      <NavLink to={authUser ? "/mybot" : "/login"}>
        <Typography
          as="li"
          variant="paragraph"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium text-blue-gray-700 "
        >
          <svg
            width="14"
            height="15"
            viewBox="0 0 14 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 0.5C1.46957 0.5 0.960859 0.710714 0.585786 1.08579C0.210714 1.46086 0 1.96957 0 2.5V4.5C0 5.03043 0.210714 5.53914 0.585786 5.91421C0.960859 6.28929 1.46957 6.5 2 6.5H4C4.53043 6.5 5.03914 6.28929 5.41421 5.91421C5.78929 5.53914 6 5.03043 6 4.5V2.5C6 1.96957 5.78929 1.46086 5.41421 1.08579C5.03914 0.710714 4.53043 0.5 4 0.5H2ZM2 8.5C1.46957 8.5 0.960859 8.71071 0.585786 9.08579C0.210714 9.46086 0 9.96957 0 10.5V12.5C0 13.0304 0.210714 13.5391 0.585786 13.9142C0.960859 14.2893 1.46957 14.5 2 14.5H4C4.53043 14.5 5.03914 14.2893 5.41421 13.9142C5.78929 13.5391 6 13.0304 6 12.5V10.5C6 9.96957 5.78929 9.46086 5.41421 9.08579C5.03914 8.71071 4.53043 8.5 4 8.5H2ZM8 2.5C8 1.96957 8.21071 1.46086 8.58579 1.08579C8.96086 0.710714 9.46957 0.5 10 0.5H12C12.5304 0.5 13.0391 0.710714 13.4142 1.08579C13.7893 1.46086 14 1.96957 14 2.5V4.5C14 5.03043 13.7893 5.53914 13.4142 5.91421C13.0391 6.28929 12.5304 6.5 12 6.5H10C9.46957 6.5 8.96086 6.28929 8.58579 5.91421C8.21071 5.53914 8 5.03043 8 4.5V2.5ZM8 10.5C8 9.96957 8.21071 9.46086 8.58579 9.08579C8.96086 8.71071 9.46957 8.5 10 8.5H12C12.5304 8.5 13.0391 8.71071 13.4142 9.08579C13.7893 9.46086 14 9.96957 14 10.5V12.5C14 13.0304 13.7893 13.5391 13.4142 13.9142C13.0391 14.2893 12.5304 14.5 12 14.5H10C9.46957 14.5 8.96086 14.2893 8.58579 13.9142C8.21071 13.5391 8 13.0304 8 12.5V10.5Z"
              fill="#334155"
            />
          </svg>
          <span
            href="#"
            className="flex items-center text-blue-gray-700 hover:text-blue-800 "
          >
            Bot của tôi
          </span>
        </Typography>
      </NavLink>

      <NavLink to={authUser ? "/chats" : "/login"}>
        <Typography
          as="li"
          variant="paragraph"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium hover:text-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
              fill="#334155"
              className="hover:text-blue-800"
            />
          </svg>

          <span href="#" className="flex items-center">
            Bạn bè
          </span>
        </Typography>
      </NavLink>
    </ul>
  );

  return (
    <>
      <Navbar className="mx-auto max-w-screen-xl px-4 py-2 lg:px-8 lg:py-4">
        <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#1976d2"
            className="size-10"
          >
            <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
            <path
              fillRule="evenodd"
              d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z"
              clipRule="evenodd"
            />
            <path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" />
          </svg>

          <div className="hidden lg:block">{navList}</div>
          {authUser ? (
            <>
              <div className="flex flex-row gap-6">
                <NotificationIcon />
                <ProfileMenu setOpen={setOpen} />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-x-1">
              <NavLink to={`/login`}>
                <Button
                  variant="text"
                  size="sm"
                  className="hidden lg:inline-block rounded-full"
                >
                  <span>Đăng nhập</span>
                </Button>
              </NavLink>
              <NavLink to={`/signup`}>
                <Button
                  size="sm"
                  className="hidden lg:inline-block bg-blue-800 rounded-full"
                >
                  <span>Đăng ký</span>
                </Button>
              </NavLink>
            </div>
          )}

          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </IconButton>
        </div>
        <Collapse open={openNav}>
          <div className="container mx-auto">
            {navList}
            <div className="flex items-center gap-x-1">
              <Button fullWidth variant="text" size="sm" className="">
                <span>Log In</span>
              </Button>
              <Button fullWidth variant="gradient" size="sm" className="">
                <span>Sign in</span>
              </Button>
            </div>
          </div>
        </Collapse>
      </Navbar>
    </>
  );
}

export default Header;
