import React, { useState } from "react";
import PillTabs, { Props } from "@components/Tabs/Pill";
import Text from "@components/Text";
import Icon from "@components/Icon";

export default {
  title: "Tabs/View",
  component: PillTabs,
  argTypes: {
    initialActiveIndex: {
      control: { type: "number" },
    },
  },
};

const navItems = ["Manager", "MenuBurger", "Apple", "Crown", "Settings"];

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
    const labels = navItems.slice(0, index + 1).map((label) => <Icon name={label} />);
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
