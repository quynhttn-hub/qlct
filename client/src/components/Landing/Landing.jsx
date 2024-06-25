import React, { useState, useEffect } from "react";
import {
  Navbar,
  Collapse,
  Button,
  IconButton,
  Typography,
  Input,
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineIcon,
  TimelineHeader,
} from "@material-tailwind/react";
import {
  RectangleStackIcon,
  UserCircleIcon,
  CommandLineIcon,
  Squares2X2Icon,
  BellIcon,
  ArchiveBoxIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Slider from "./Slider";

function NavItem({ children }) {
  return (
    <li>
      <Typography
        as="a"
        href="#"
        variant="paragraph"
        color="blue-gray"
        className="text-blue-gray-700 font-medium flex items-center gap-2 "
      >
        {children}
      </Typography>
    </li>
  );
}

function Landing() {
 
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);


  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpen(false),
    );
  }, []);

  return (
    <div className="flex flex-col h-full w-full place-content-center gap-12">
      <div className="w-full container mx-auto px-4 text-center mb-8">
        <Typography
          variant="h1"
          color="blue-gray"
          className="mx-auto my-1 w-full leading-snug  !text-2xl  lg:!text-5xl"
        >
          Quản lý chi tiêu{" "}
          <span className="text-blue-600 leading-snug ">đơn giản</span> và{" "}
          <span className="leading-snug text-blue-600">hiệu quả</span>
        </Typography>
        <Typography
          variant="lead"
          className="mx-auto w-full !text-gray-500 text-xs text-base"
        >
          Công cụ thống kê lại chi tiêu, kế hoạch chi tiêu, thu nhập
        </Typography>
      </div>
      <div className="w-[40rem] container mx-auto px-4 ">
        <Timeline>
          <TimelineItem className="h-28">
            <TimelineConnector className="!w-[78px]" />
            <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-white py-3 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
              <TimelineIcon className="p-3" variant="ghost">
                <BellIcon className="h-5 w-5" />
              </TimelineIcon>
              <div className="flex flex-col gap-1">
                <Typography variant="h6" color="blue-gray">
                  Tạo file google sheet
                </Typography>
                <Typography
                  variant="small"
                  color="gray"
                  className="font-normal"
                >
                  Tạo file quản lý cá nhân hoặc file quản lý chi tiêu chung theo
                  template được thiết kế sẵn.
                </Typography>
              </div>
            </TimelineHeader>
          </TimelineItem>
          <TimelineItem className="h-28">
            <TimelineConnector className="!w-[78px]" />
            <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-white py-3 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
              <TimelineIcon className="p-3" variant="ghost" color="red">
                <ArchiveBoxIcon className="h-5 w-5" />
              </TimelineIcon>
              <div className="flex flex-col gap-1">
                <Typography variant="h6" color="blue-gray">
                  Chat với bạn bè, tạo nhóm
                </Typography>
                <Typography
                  variant="small"
                  color="gray"
                  className="font-normal"
                >
                  Tạo nhóm với gia đình, bạn bè để cùng quản lý chi tiêu, lập kế
                  hoạch chung.
                </Typography>
              </div>
            </TimelineHeader>
          </TimelineItem>
          <TimelineItem className="h-28">
            <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-white py-3 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
              <TimelineIcon className="p-3" variant="ghost" color="green">
                <CurrencyDollarIcon className="h-5 w-5" />
              </TimelineIcon>
              <div className="flex flex-col gap-1">
                <Typography variant="h6" color="blue-gray">
                  Gọi câu lệnh trong tin nhắn để lưu thông tin
                </Typography>
                <Typography
                  variant="small"
                  color="gray"
                  className="font-normal"
                >
                  Gọi câu lệnh chi tiêu, lập kế hoạch, thu nhập và hạng mục, số
                  tiền tương ứng để hệ thống tự động thống kê vào file.
                </Typography>
              </div>
            </TimelineHeader>
          </TimelineItem>
        </Timeline>
      </div>
      {/* <div className="h-1/2 container w-3/4 mx-auto text-center">
        <Slider />
      </div> */}
    </div>
  );
}

export default Landing;