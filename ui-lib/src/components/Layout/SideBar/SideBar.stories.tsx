import * as React from "react";
import SideBar from "./SideBar";
import type { SideBarProps } from "./SideBar";
import { action } from "@storybook/addon-actions";
import PortfolioIcon from "@ui/assets/icons/PortfolioMedium";
import WalletIcon from "@ui/assets/icons/WalletMedium";
import ManagerIcon from "@ui/assets/icons/ManagerMedium";
import ArrowTopIcon from "@ui/assets/icons/ArrowTopMedium";
import ArrowBottomIcon from "@ui/assets/icons/ArrowBottomMedium";
import BuyCryptoAltIcon from "@ui/assets/icons/BuyCryptoAltMedium";
import BuyCryptoIcon from "@ui/assets/icons/BuyCryptoMedium";
import LendIcon from "@ui/assets/icons/LendMedium";
import NanoFoldedIcon from "@ui/assets/icons/NanoFoldedMedium";

import { useArgs } from "@storybook/client-api";

export default {
  title: "Navigation/SideBar",
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
      <SideBar.Item onClick={action("go to portfolio")} label="portfolio">
        <PortfolioIcon />
      </SideBar.Item>
      <SideBar.Item onClick={action("go to accounts")} label="accounts" isActive>
        <WalletIcon />
      </SideBar.Item>
      <SideBar.Item onClick={action("go to discover")} label="discover" isDisabled>
        <ManagerIcon />
      </SideBar.Item>
      <SideBar.Item onClick={action("go to send")} label="send" isDisabled>
        <ArrowTopIcon />
      </SideBar.Item>
      <SideBar.Item onClick={action("go to receive")} label="receive">
        <ArrowBottomIcon />
      </SideBar.Item>
      <SideBar.Item onClick={action("go to buy / Sell")} label="buy / Sell">
        <BuyCryptoAltIcon />
      </SideBar.Item>
      <SideBar.Item onClick={action("go to exchange")} label="exchange">
        <BuyCryptoIcon />
      </SideBar.Item>
      <SideBar.Item onClick={action("go to lend")} label="lend">
        <LendIcon />
      </SideBar.Item>
      <SideBar.Item onClick={action("go to manager")} label="manager">
        <NanoFoldedIcon />
      </SideBar.Item>
    </SideBar>
  );
};

export const Default = Template.bind({});
Default.args = {
  onToggle: action("toggle sidebar"),
  isExpanded: true,
};
