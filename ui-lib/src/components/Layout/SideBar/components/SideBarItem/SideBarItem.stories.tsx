import * as React from "react";
import SideBarItem from "./SideBarItem";
import { action } from "@storybook/addon-actions";
import AccountsIcon from "@ui/assets/icons/Accounts";
import type { SideBarItemType } from './SideBarItem';
import { SideBarContext } from "@ui/components/Layout/SideBar/SideBar";
import Text from "@ui/components/Text";
import Flex from "@ui/components/Layout/Flex";

export default {
  title: "Navigation/SideBar/SideBarItem",
  component: SideBarItem,
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
    isDisable: { control: false },
  },
};

const Template = (args: SideBarItemType) => (
  <Flex flexDirection="column" style={{rowGap: "1.5rem"}}>
    <Flex flexDirection="column" alignItems="flex-Start" style={{ width: "fit-content", rowGap: "0.5rem" }}>
      <Text type="h3">Expanded</Text>
      <SideBarContext.Provider value={{ isExpanded: true, onToggle: () => {} }}>
        <SideBarItem {...args}>
          <AccountsIcon />
        </SideBarItem>
      </SideBarContext.Provider>
    </Flex>

    <Flex flexDirection="column" alignItems="flex-Start" style={{ width: "fit-content", rowGap: "0.5rem" }}>
      <Text type="h3">Collapsed</Text>
      <SideBarContext.Provider value={{ isExpanded: false, onToggle: () => {} }}>
        <SideBarItem {...args}>
          <AccountsIcon />
        </SideBarItem>
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
  isDisable: true,
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
