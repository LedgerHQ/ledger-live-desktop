// @flow
import React, { useCallback } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import type { Account, TokenAccount } from "@ledgerhq/live-common/lib/types";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { urls } from "~/config/urls";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import InfoCircle from "~/renderer/icons/InfoCircle";
import FormattedVal from "~/renderer/components/FormattedVal";
import { openURL } from "~/renderer/linking";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { FakeLink } from "~/renderer/components/Link";

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
  account: TokenAccount,
  parentAccount: ?Account,
};

const SupplyBanner = ({ account, parentAccount }: Props) => {
  const { t } = useTranslation();

  const onClickHelp = useCallback(() => {
    openURL(urls.compound);
  }, []);

  const accountUnit = getAccountUnit(account);

  return (
    <Container>
      <InfoCircle size={12} />
      <Text ff="Inter|Medium" fontSize={3} style={{ paddingLeft: 8 }}>
        {t("lend.supply.steps.amount.maxSupply")}
      </Text>
      <Text ff="Inter|Bold" fontSize={3} style={{ paddingLeft: 4 }}>
        ~
      </Text>
      <Text ff="Inter|Bold" fontSize={3} style={{ paddingLeft: 2 }}>
        <FormattedVal
          style={{ width: "auto" }}
          color="palette.text.shade100"
          val={account.spendableBalance}
          unit={accountUnit}
          showCode
        />
      </Text>
      <Text ff="Inter|SemiBold" fontSize={3} style={{ marginLeft: "auto" }}>
        <FakeLink onClick={onClickHelp}>{t("common.learnMore")}</FakeLink>
      </Text>
    </Container>
  );
};

export default SupplyBanner;
