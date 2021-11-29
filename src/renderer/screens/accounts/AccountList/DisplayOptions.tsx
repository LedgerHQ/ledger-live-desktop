import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import PillTabs from "@ledgerhq/react-ui/components/tabs/Pill";
import { Icons } from "@ledgerhq/react-ui";
import { setAccountsViewMode } from "~/renderer/actions/settings";
import { accountsViewModeSelector } from "~/renderer/reducers/settings";
import AccountsOrder from "./Order";
import AccountsRange from "./Range";
import { track } from "~/renderer/analytics/segment";
import FlexBox from "@ledgerhq/react-ui/components/layout/Flex";

const tabs = [
  {
    mode: "list",
    event: "Account view table",
    node: <Icons.MenuBurgerMedium id="accounts-display-list" />,
  },
  {
    mode: "card",
    event: "Account view mosaic",
    node: <Icons.ManagerMedium id="accounts-display-grid" />,
  },
].map((m, index) => ({ ...m, index }));

function DisplayOptions() {
  const dispatch = useDispatch();
  const mode = useSelector(accountsViewModeSelector);

  const onTabChange = useCallback(
    (index: number) => {
      const newTab = tabs[index];
      if (!newTab) return;
      track(newTab.event);
      dispatch(setAccountsViewMode(newTab.mode));
    },
    [dispatch],
  );
  const activeIndex = tabs.findIndex(tab => tab.mode === mode);

  return (
    <FlexBox flexDirection="row" alignSelf="flex-end">
      <AccountsRange />
      <FlexBox ml="20px" mr="20px">
        <AccountsOrder />
      </FlexBox>
      <PillTabs onTabChange={onTabChange} initialActiveIndex={activeIndex}>
        {tabs.map(({ node }) => node)}
      </PillTabs>
    </FlexBox>
  );
}

export default React.memo(DisplayOptions);
