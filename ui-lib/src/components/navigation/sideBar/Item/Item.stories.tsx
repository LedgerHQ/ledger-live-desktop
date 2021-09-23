import React from "react";
import Item from "@ui/components/navigation/sideBar/Item";
import { action } from "@storybook/addon-actions";
import WalletIcon from "@ui/assets/icons/WalletMedium";
import type { ItemType } from "./Item";
import SideBarContext from "@ui/components/navigation/sideBar";
import Text from "@ui/components/asorted/Text";
import Flex from "@ui/components/layout/Flex";

export default {
  title: "Navigation/SideBar/Item",
  component: Item,
  argTypes: {
    label: {
      type: "text",
      description: "Label",
      required: true,
      control: { type: "text" },
    },
    onClick: { control: false },
    children: { control: false },
    isActive: { control: false },
    isDisabled: { control: false },
  },
};

const Template = (args: ItemType) => (
  <Flex flexDirection="column" style={{ rowGap: "1.5rem" }}>
    <Flex
      flexDirection="column"
      alignItems="flex-Start"
      style={{ width: "fit-content", rowGap: "0.5rem" }}
    >
      <Text type="h3">Expanded</Text>
      <SideBarContext.Provider value={{ isExpanded: true, onToggle: () => {} }}>
        <Item {...args}>
          <WalletIcon />
        </Item>
      </SideBarContext.Provider>
    </Flex>

    <Flex
      flexDirection="column"
      alignItems="flex-Start"
      style={{ width: "fit-content", rowGap: "0.5rem" }}
    >
      <Text type="h3">Collapsed</Text>
      <SideBarContext.Provider value={{ isExpanded: false, onToggle: () => {} }}>
        <Item {...args}>
          <WalletIcon />
        </Item>
      </SideBarContext.Provider>
    </Flex>
  </Flex>
);

export const Default = Template.bind({});
export const Hover = Template.bind({});
export const Focus = Template.bind({});
export const Active = Template.bind({});
export const Disable = Template.bind({});

Default.args = {
  label: "accounts",
  onClick: action("go to accounts"),
};
Active.args = {
  label: "accounts",
  onClick: action("go to accounts"),
  isActive: true,
};
Disable.args = {
  label: "accounts",
  onClick: action("go to accounts"),
  isDisabled: true,
};
Hover.args = {
  label: "accounts",
  onClick: action("go to accounts"),
};
Hover.parameters = { pseudo: { hover: true } };
Focus.args = {
  label: "accounts",
  onClick: action("go to accounts"),
};
Focus.parameters = { pseudo: { focus: true } };
