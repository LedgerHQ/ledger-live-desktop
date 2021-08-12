import * as React from "react";
import SideBarItem from "./SideBarItem";
import { action } from "@storybook/addon-actions";
import AccountsIcon from "@ui/assets/icons/Accounts";
import type { SideBarItemType } from './SideBarItem';

export default {
  title: "Layout/SideBar/SideBarItem",
  component: SideBarItem,
  argTypes: {
    label: {
      type: "text",
      description: "Label",
      required: true,
      control: {
        type: "text",
      },
    },
    onClick: { control: false },
    children: { control: false },
    isActive: { control: false },
    isDisable: { control: false },
  },
};

const Template = (args: SideBarItemType) => (
  <SideBarItem {...args}>
    <AccountsIcon />
  </SideBarItem>
);

export const Default = Template.bind({});
export const Hover = Template.bind({});
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