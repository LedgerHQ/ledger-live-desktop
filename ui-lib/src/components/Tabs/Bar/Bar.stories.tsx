import React from "react";
import BarTabs, { Props } from "@components/Tabs/Bar";
import Text from "@components/Text";

export default {
  title: "Tabs/Graph",
  component: BarTabs,
  argTypes: {
    initialActiveIndex: {
      control: { type: "number" },
    },
  },
};

const navItems = ["One", "Two", "Three", "Four", "Five"];
function makeItem(
  args: Props,
  key: string | number,
  content: React.ReactNode | React.ReactNodeArray,
) {
  return (
    <div style={{ marginBottom: "10px" }} key={key}>
      <div style={{ width: "100px", marginTop: "10px" }}>
        <BarTabs {...args}>{content}</BarTabs>
      </div>
    </div>
  );
}

export const Graph = (args: Props): JSX.Element[] =>
  navItems.reduce<JSX.Element[]>((acc, _, index) => {
    const content = navItems.slice(0, index + 1).map(label => (
      <Text color="inherit" type="navigation">
        {label}
      </Text>
    ));
    return [...acc, makeItem(args, index, content)];
  }, []);

Graph.args = {
  initialActiveIndex: 1,
};
