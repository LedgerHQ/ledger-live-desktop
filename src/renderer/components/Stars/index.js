// @flow
import React from "react";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import Hide from "~/renderer/components/MainSideBar/Hide";
import Text from "~/renderer/components/Text";
import Tooltip from "~/renderer/components/Tooltip";
import Image from "~/renderer/components/Image";
import emptyBookmarksDark from "~/renderer/images/dark-empty-bookmarks.png";
import emptyBookmarksLight from "~/renderer/images/light-empty-bookmarks.png";

import Item from "./Item";
import { starredAccountsSelector } from "~/renderer/reducers/accounts";

const Container: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: column;
`;
const Placeholder: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  text-align: center;
  padding: 0px 8px;
  & > :first-child {
    margin-bottom: 14px;
  }
`;

type Props = {
  pathname: string,
  collapsed: boolean,
};

const Stars = ({ pathname, collapsed }: Props) => {
  const starredAccounts = useSelector(starredAccountsSelector);

  return starredAccounts && starredAccounts.length ? (
    <Container key={pathname}>
      {starredAccounts.map((account, i) => (
        <Tooltip
          content={account.type === "Account" ? account.name : getAccountCurrency(account).name}
          delay={collapsed ? 0 : 1200}
          key={account.id}
          placement={collapsed ? "right" : "top"}
          boundary={collapsed ? "window" : undefined}
          enabled
          flip={!collapsed}
        >
          <Item
            index={i}
            key={account.id}
            account={account}
            pathname={pathname}
            collapsed={collapsed}
          />
        </Tooltip>
      ))}
    </Container>
  ) : (
    <Hide visible={!collapsed}>
      <Placeholder>
        <Image
          alt="stars placeholder"
          resource={{
            light: emptyBookmarksLight,
            dark: emptyBookmarksDark,
          }}
          width="95"
          height="53"
        />
        <Text
          ff="Inter|SemiBold"
          color="palette.text.shade60"
          fontSize={3}
          style={{ minWidth: 180 }}
        >
          <Trans i18nKey={"stars.placeholder"}>
            {"Accounts that you star on the"}
            <Text ff="Inter|SemiBold" color="palette.text.shade100">
              {"Accounts"}
            </Text>
            {" page will now appear here!."}
          </Trans>
        </Text>
      </Placeholder>
    </Hide>
  );
};

export default Stars;
