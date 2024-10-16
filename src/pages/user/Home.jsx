// src/pages/user/Home.jsx
import React from "react";
import { Carousel, Image, Button, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import color from "../../assets/color.avif";
import color1 from "../../assets/color1.avif";
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex flex-col justify-center items-center ">
      <div className="flex flex-col justify-center items-center pt-10">
        <h1 className="text-3xl font-semibold font-serif">Company Name</h1>
        <div className="w-[90%]">
          <p className="text-sm text-gray-500 text-center py-10 font-serif">
            Best shop blablabalaBest shop blablabala Best shop blablabala Best
            shop blablabala Best shop blablabala Best shop blablabala Best
            shopsss
          </p>
        </div>
        <div className="pt-5 pb-5">
          <Button
            onClick={() => {
              navigate("/book");
            }}
            type="primary"
          >
            <p className="font-serif">Book an Appointment!</p>
          </Button>
        </div>
        <Divider />
      </div>
      <div className="w-full h-full  flex justify-center  ">
        <div className="w-full  sm:w-[600px] sm:full   ">
          <Carousel autoplay>
            <div className="w-full h-full">
              <Image
                // width="100%"
                // height={500}
                // maxWidth={100}
                // className="w-full h-full object-cover" // Full width and height, cover the carousel
                src={color1}
              />
            </div>
            <div className="w-full h-full">
              <Image
                // width="100%"
                // height={500}
                // maxWidth={100}
                // className="w-full h-full object-cover" // Full width and height, cover the carousel
                src={color}
              />
            </div>
          </Carousel>
        </div>
      </div>
      <Divider />
      <div className="w-[90%] flex flex-col  space-y-2">
        <p className="font-semibold font-serif">
          Monday - Sunday: 9:30 AM - 6:30 PM
        </p>
        <p className="font-serif">
          Mesa Nail offers a variety of beauty enhancements such as (manicure,
          pedicure, UV gel). Our licensed and certified professionals provide
          with a uniquely customized experience.
        </p>
        <p className="font-serif">
          Treat yourself with our beauty and relaxing services and it's worth a
          try. We have promos to avail during holidays and special occasions to
          make sure you can have your personal time to relax. Give your family
        </p>
      </div>
      <Divider />
      <div className="w-full flex flex-col justify-center items-center">
        <h1 className="text-2xl font-semibold font-serif">Contact Me</h1>

        <p className="font-serif">
          <a href="tel:+1234567890">+1 (234) 567-890</a>
        </p>
      </div>
    </div>
  );
};

export default Home;
