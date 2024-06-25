import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "./styles.css";

const Slider = () => {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    fetch("../../video_data.json")
      .then((response) => response.json())
      .then((data) => {
        setVideos(data);
      })
      .catch((error) => console.error("Error fetching video data:", error));
  }, []);
  return (
    <Swiper
      modules={[Autoplay, Navigation, Pagination]}
      spaceBetween={30}
      slidesPerView={3}
      navigation
      pagination={{ clickable: true }}
      // autoplay={{
      //   delay: 2000,
      //   disableOnInteraction: false,
      // }}
    >
      {videos.map((video) => (
        <SwiperSlide key={video.video_embed_url}>
          <iframe
            style={{ borderRadius: "10px" }}
            width="100%"
            height="70%"
            src={video.video_embed_url}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
          <Typography variant="h5" color="blue-gray" className="mt-4">
            {`${video.title.slice(0, 40)}...`}
          </Typography>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Slider;
