// @flow
import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import type { Account, AccountLike, Transaction } from "@ledgerhq/live-common/lib/types";
import { useDebounce } from "@ledgerhq/live-common/lib//hooks/useDebounce";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { urls } from "~/config/urls";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import InfoCircle from "~/renderer/icons/InfoCircle";
import FormattedVal from "~/renderer/components/FormattedVal";
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
  const [maxSpendable, setMaxSpendable] = useState(null);

  const onClickHelp = useCallback(() => {
    openURL(urls.maxSpendable);
  }, []);

  const debouncedTransaction = useDebounce(transaction, 500);

  useEffect(() => {
    if (!account) return;
    let cancelled = false;
    getAccountBridge(account, parentAccount)
      .estimateMaxSpendable({
        account,
        parentAccount,
        transaction: debouncedTransaction,
      })
      .then(estimate => {
        if (cancelled) return;
        setMaxSpendable(estimate);
      });

    return () => {
      cancelled = true;
    };
  }, [account, parentAccount, debouncedTransaction]);

  const accountUnit = getAccountUnit(account);

  return (
    <Container>
      <InfoCircle size={12} />
      <Text ff="Inter|Medium" fontSize={3} style={{ paddingLeft: 8 }}>
        {t("send.steps.amount.banner")}
      </Text>
      <Text ff="Inter|Bold" fontSize={3} style={{ paddingLeft: 4 }}>
        ~
      </Text>
      <Text ff="Inter|Bold" fontSize={3} style={{ paddingLeft: 2 }}>
        {maxSpendable ? (
          <FormattedVal
            style={{ width: "auto" }}
            color="palette.text.shade100"
            val={maxSpendable}
            unit={accountUnit}
            showCode
          />
        ) : null}
      </Text>
      <Text ff="Inter|SemiBold" fontSize={3} style={{ marginLeft: "auto" }}>
        <FakeLink onClick={onClickHelp}>{t("common.learnMore")}</FakeLink>
      </Text>
    </Container>
  );
};

export default SpendableBanner;
