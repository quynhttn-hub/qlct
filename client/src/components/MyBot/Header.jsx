import  { useEffect, useState } from "react";
import {
  Typography,
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { toast } from "react-toastify";
import useConversation from "../../zustand/useConversation";
import { apiUrl } from "../../../setupAxios";
import { useAuthContext } from "../../Context/AuthContext";

const Header = () => {
  const { myChat } = ChatState();
  const [spending, setSpending] = useState(null);
  const { messages } = useConversation();
  const {authUser} = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        };
        const { data } = await axios.get(
          `${apiUrl}/api/chat/spending/${myChat._id}`,
          config
        );
        if (data == 0) {
          setSpending({ day: 0, week: 0, month: 0 });
        } else {
          setSpending(data);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (myChat) {
      fetchData();
    }
  }, [myChat, messages]);

  return (
    <div className="flex ml-auto p-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="orange"
        className="size-6"
      >
        <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
        <path
          fillRule="evenodd"
          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z"
          clipRule="evenodd"
        />
      </svg>
      <Typography variant="h6" className="mr-2">
        Tổng chi tiêu:
      </Typography>
      <div className="flex gap-4">
        {/* ngày */}
        <Popover>
          <PopoverHandler>
            <button className="hover:text-blue-500">Ngày</button>
          </PopoverHandler>
          <PopoverContent>
            <div className="flex items-center">
              <Typography variant="h6" className="mr-2">
                Hôm nay:
              </Typography>
              <span className="mr-2 text-red-500">
                {spending?.day?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>
          </PopoverContent>
        </Popover>

        {/* Tuần */}
        <Popover>
          <PopoverHandler>
            <button className="hover:text-blue-500">Tuần</button>
          </PopoverHandler>
          <PopoverContent>
            <div className="flex items-center">
              <Typography variant="h6" className="mr-2">
                Tuần này:
              </Typography>
              <span className="mr-2 text-red-500">
                {spending?.week?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>
          </PopoverContent>
        </Popover>

        {/* Tháng */}
        <Popover>
          <PopoverHandler>
            <button className="hover:text-blue-500">Tháng</button>
          </PopoverHandler>
          <PopoverContent>
            <div className="flex items-center">
              <Typography variant="h6" className="mr-2">
                Tháng này:
              </Typography>
              <span className="mr-2 text-red-500">
                {spending?.month?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Header;
