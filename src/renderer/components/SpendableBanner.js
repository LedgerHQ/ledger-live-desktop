// @flow
import React, { useCallback } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import type { Account, AccountLike, Transaction } from "@ledgerhq/live-common/lib/types";
import { urls } from "~/config/urls";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import InfoCircle from "~/renderer/icons/InfoCircle";
import SpendableAmount from "~/renderer/components/SpendableAmount";
import { openURL } from "~/renderer/linking";
import Box from "./Box";
import Text from "./Text";
import { FakeLink } from "./Link";

const Container: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
  py: 1,
  px: 2,
  bg: "palette.text.shade10",
}))`
  border-radius: 4px;
  align-items: center;
`;

type Props = {
  account: AccountLike,
  transaction: Transaction,
  parentAccount: ?Account,
};

const SpendableBanner = ({ account, parentAccount, transaction }: Props) => {
  const { t } = useTranslation();

  const onClickHelp = useCallback(() => {
    openURL(urls.maxSpendable);
  }, []);

  return (
    <Container>
      <InfoCircle size={12} />
      <Text ff="Inter|Medium" fontSize={3} style={{ paddingLeft: 8 }}>
        {t("send.steps.amount.banner")}
      </Text>
      <Text ff="Inter|Bold" fontSize={3} style={{ paddingLeft: 2 }}>
        <SpendableAmount
          account={account}
          parentAccount={parentAccount}
          transaction={transaction}
          prefix="~"
        />
      </Text>
      <Text ff="Inter|SemiBold" fontSize={3} style={{ marginLeft: "auto" }}>
        <FakeLink onClick={onClickHelp}>{t("common.learnMore")}</FakeLink>
      </Text>
    </Container>
  );
};

export default SpendableBanner;
