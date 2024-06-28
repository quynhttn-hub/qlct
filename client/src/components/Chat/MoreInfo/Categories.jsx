import { useState, useEffect } from "react";
import { Typography, Input, List, Accordion } from "@material-tailwind/react";
import axios from "axios";
import { ChatState } from "../../../Context/ChatContext";
import { toast } from "react-toastify";
import { useOurCategoriesContext } from "../../../Context/useOurCategories";
import ListMembers from "./ListMembers";
import { apiUrl } from "../../../../setupAxios";
import { useAuthContext } from "../../../Context/AuthContext";

export const Categories = () => {
  const { selectedChat } = ChatState();

  const [members, setMembers] = useState([]);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {selectedChat.isGroupChat && <ListMembers members={members} />}
    </div>
  );
};
