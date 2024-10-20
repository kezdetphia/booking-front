import React from "react";

import { Divider, Flex, Tag } from "antd";

function DayCalendarChip() {
  const getHours = () => {
    const hours = [];
    for (let i = 7; i <= 18; i++) {
      hours.push(i);
    }
    return hours;
  };

  <>
    <Divider orientation="left">Without icon</Divider>
    <Flex gap="4px 0" wrap>
      {getHours().map((hour) => (
        <Tag color="blue" key={hour}>
          {hour}
        </Tag>
      ))}
      {/* <Tag color="success">success</Tag>
      <Tag color="processing">processing</Tag>
      <Tag color="error">error</Tag>
      <Tag color="warning">warning</Tag>
      <Tag color="default">default</Tag> */}
    </Flex>
  </>;
}

export default DayCalendarChip;
