import React from "react";

import { Divider, Flex, Tag } from "antd";

function DayCalendarChip() {
  return (
    <>
      <Divider orientation="left">Without icon</Divider>
      <Flex gap="4px 0" wrap>
        <Tag color="success">success</Tag>
        <Tag color="processing">processing</Tag>
        <Tag color="error">error</Tag>
        <Tag color="warning">warning</Tag>
        <Tag color="default">default</Tag>
      </Flex>
    </>
  );
}

export default DayCalendarChip;
