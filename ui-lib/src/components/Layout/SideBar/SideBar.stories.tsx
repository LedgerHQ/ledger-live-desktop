import * as React from "react";
import SideBar from "./SideBar";
import type { SideBarProps } from './SideBar';
import { action } from '@storybook/addon-actions';
import AccountsIcon from "@ui/assets/icons/Accounts";
import BuyIcon from "@ui/assets/icons/Buy";
import DiscoverIcon from "@ui/assets/icons/Discover";
import ExchangeIcon from "@ui/assets/icons/Exchange";
import LendIcon from "@ui/assets/icons/Lend";
import ManagerIcon from "@ui/assets/icons/Manager";
import PortfolioIcon from "@ui/assets/icons/Portfolio";
import ReceiveIcon from "@ui/assets/icons/Receive";
import SendIcon from "@ui/assets/icons/Send";
import { useArgs } from "@storybook/client-api";

export default {
  title: "Layout/SideBar",
  component: SideBar,
  argTypes: {
    children: {
      type: "text",
      description: "A list a SideBar.Item",
      required: true,
      control: false,
    },
    isExpanded: { control: false },
    onToggle: { control: false },
  },
};


const Template = (args: SideBarProps) => {
  const [currentArgs, updateArgs] = useArgs();
  
  const handleToggle = () => updateArgs({ isExpanded: !currentArgs.isExpanded });
  
  return (
    <SideBar {...args} onToggle={handleToggle}>
        <SideBar.Item  onClick={action('go to portfolio')} label="portfolio"><PortfolioIcon /></SideBar.Item>
        <SideBar.Item  onClick={action('go to accounts')} label="accounts" isActive><AccountsIcon /></SideBar.Item>
        <SideBar.Item  onClick={action('go to discover')} label="discover" isDisable><DiscoverIcon /></SideBar.Item>
        <SideBar.Item  onClick={action('go to send')} label="send" isDisable><SendIcon /></SideBar.Item>
        <SideBar.Item  onClick={action('go to receive')} label="receive"><ReceiveIcon /></SideBar.Item>
        <SideBar.Item  onClick={action('go to buy / Sell')} label="buy / Sell"><BuyIcon /></SideBar.Item>
        <SideBar.Item  onClick={action('go to exchange')} label="exchange"><ExchangeIcon /></SideBar.Item>
        <SideBar.Item  onClick={action('go to lend')} label="lend"><LendIcon /></SideBar.Item>
        <SideBar.Item  onClick={action('go to manager')} label="manager"><ManagerIcon /></SideBar.Item>
    </SideBar>
);};

export const Default = Template.bind({});
Default.args = {
  onToggle: action('toggle sidebar'),
  isExpanded: true,
};
