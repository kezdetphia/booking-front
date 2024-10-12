import React from "react";
import { useAuth } from "../../context/authContext";
import { Card } from "antd";
import thanksImage from "../../assets/thanks.png";

const { Meta } = Card;

function AppointmentConfirm() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="font-serif text-xl text-center pt-5">
        Thanks for booking an appointment {user?.username} 😊 💅🏻
      </h1>
      <div className="pt-10">
        <Card
          hoverable
          style={{
            width: "100%",
          }}
          cover={<img alt="example" src={thanksImage} />}
        >
          <Meta
            title={<p className="font-serif">Do you need to reschedule?</p>}
            description={
              <p className="font-serif ">
                Please contact us at{" "}
                <a href="tel:+1234567890" className="font-serif text-blue-500">
                  +1 (234) 567-890
                </a>
              </p>
            }
          />
        </Card>
      </div>
    </div>
  );
}

export default AppointmentConfirm;
