import React, { useState } from "react";
import PillTabs, { Props } from "@components/Tabs/Pill";
import Text from "@components/Text";

export default {
  title: "Tabs/View",
  component: PillTabs,
  argTypes: {
    initialActiveIndex: {
      control: { type: "number" },
    },
  },
};

const navItems = ["One", "Two", "Three", "Four", "Five"];

function Sample({ children, ...args }: Props) {
  const [activeIndex, setActiveIndex] = useState(args.initialActiveIndex);
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ width: "100px" }}>
        <PillTabs {...args} onTabChange={setActiveIndex}>
          {children}
        </PillTabs>
      </div>
      <Text type="subTitle">Active index: {activeIndex}</Text>
      <hr />
    </div>
  );
}

export const View = (args: Props): JSX.Element[] =>
  navItems.reduce<JSX.Element[]>((acc, _, index) => {
    const labels = navItems.slice(0, index + 1).map(label => (
      <Text color="inherit" type="navigation">
        {label}
      </Text>
    ));
    return [
      ...acc,
      <Sample {...args} key={index}>
        {labels}
      </Sample>,
    ];
  }, []);

View.args = {
  initialActiveIndex: 1,
};
