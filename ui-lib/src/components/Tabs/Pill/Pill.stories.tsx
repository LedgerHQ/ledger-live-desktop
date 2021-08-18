import React from "react";
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
export const View = (args: Props): JSX.Element[] =>
  navItems.reduce<JSX.Element[]>((acc, _, index) => {
    const elt = (
      <div style={{ marginBottom: "10px" }} key={index}>
        <div style={{ width: "100px", marginTop: "10px" }}>
          <PillTabs {...args}>
            {navItems.slice(0, index + 1).map(label => (
              <Text color="inherit" type="navigation">
                {label}
              </Text>
            ))}
          </PillTabs>
        </div>
      </div>
    );
    return [...acc, elt];
  }, []);
View.args = {
  initialActiveIndex: 1,
};
