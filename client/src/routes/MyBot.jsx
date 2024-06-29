import { Sidebar } from "../components/MyBot/Sidebar";
import MessageBox from "../components/MyBot/MessageBox";
import MentionInput from "../components/MyBot/MessageInput";
import { MyCategoryProvider } from "../Context/MyCategoryContext";
import Header from "../components/MyBot/Header";
import { useAuthContext } from "../Context/AuthContext";
import { ChatState } from "../Context/ChatProvider";
import { useEffect } from "react";

const MyBot = () => {
  const { authUser } = useAuthContext();

  const { myChat, setMyChat } = ChatState();

  useEffect(() => {
    if (authUser) {
      setMyChat(authUser.myChat);
    }
  }, [authUser]);
  

  if (!authUser) return (
    <div >
      <h1>Unauthorized</h1>
    </div>);

  return (
    <MyCategoryProvider>
      <div className="h-5/6 max-w-screen-xl w-full flex flex-row m-4 bg-white rounded-lg">
        <div className="w-1/4 rounded-xl shadow-md hidden lg:flex">
          <Sidebar />
        </div>

        <div className="flex-1 rounded-xl shadow-md h-full flex flex-col">
          <Header />
          <MessageBox className="flex-1" />

          <div className="mt-auto">
            <MentionInput />
          </div>
        </div>
      </div>
    </MyCategoryProvider>
  );
};

export default MyBot;
