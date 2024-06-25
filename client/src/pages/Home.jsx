import Header from "../layouts/Header";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProfileDialog from "../components/Profile/ProfileDialog";
import { useState } from "react";

function Home() {
  const [open, setOpen] = useState(false);
  return (
    <div className="h-screen flex flex-col items-center w-full">
      <ToastContainer />
      <Header setOpen={setOpen} />
      <Outlet />
      {open && <ProfileDialog setOpen={setOpen} />}
    </div>
  );
}

export default Home;
