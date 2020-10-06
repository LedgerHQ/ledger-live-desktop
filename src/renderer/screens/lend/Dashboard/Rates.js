// @flow
import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { BigNumber } from "bignumber.js";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import type { AccountLikeArray } from "@ledgerhq/live-common/lib/types";
import type { CurrentRate } from "@ledgerhq/live-common/lib/families/ethereum/modules/compound";
import { formatShort } from "@ledgerhq/live-common/lib/currencies";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { flattenSortAccountsSelector } from "~/renderer/actions/general";
import Box from "~/renderer/components/Box";
import Card from "~/renderer/components/Box/Card";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import Ellipsis from "~/renderer/components/Ellipsis";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import ToolTip from "~/renderer/components/Tooltip";
// import CounterValue from "~/renderer/components/CounterValue";
import FormattedVal from "~/renderer/components/FormattedVal";
import { openModal } from "~/renderer/actions/modals";
import Pill from "./Pill";

const Header = styled(Box)`
  border-bottom: 1px solid ${p => p.theme.colors.palette.divider};

  > * {
    flex-basis: 20%;
  }

  > *:first-child {
    flex-basis: 25%;
    max-width: 25%;
  }

  > *:nth-child(4) {
    flex-basis: 15%;
    text-align: center;
  }

  > *:last-child {
    text-align: right;
  }
`;

const RowContent = styled(Box)`
  display: flex;
  align-items: center;
  flex-direction: row;
  box-sizing: border-box;
  padding: 10px 24px;

  > * {
    flex-basis: 20%;
    display: flex;
    align-items: center;
    flex-direction: row;
    box-sizing: border-box;
    max-width: 20%;
  }

  > *:first-child {
    flex-basis: 25%;
    max-width: 25%;
  }

  > *:nth-child(4) {
    flex-basis: 15%;
    max-width: 15%;
    text-align: center;
  }

  &:hover {
    background: ${p => p.theme.colors.palette.background.default};
  }
`;

const RowAccount = styled(Box)`
  margin-left: 12px;
  align-items: flex-start;
  /* the calc here uses the margin left + icon size */
  max-width: calc(90% - 12px - 32px);
`;

const Amount = styled(Box)`
  flex-direction: column;
  align-items: flex-start;
`;

const Action: ThemedComponent<{}> = styled.div`
  justify-content: flex-end;
  cursor: pointer;
  color: ${p => p.theme.colors.palette.text.shade50};
`;

const CompactButton = styled(Button)`
  padding: 7px 8px;
  height: auto;
`;

const Row = ({ data, accounts }: { data: CurrentRate, accounts: AccountLikeArray }) => {
  const { token, totalSupply, supplyAPY } = data;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const openManageModal = useCallback(() => {
    const account = accounts.find(a => a.type === "TokenAccount" && a.token.id === token.id);
    const parentAccount = accounts.find(a => a.parentId === a.id);
    dispatch(openModal("MODAL_LEND_MANAGE", { account, parentAccount }));
  }, [dispatch, accounts, token]);

  const grossSupply = useMemo((): string => {
    return formatShort(token.units[0], totalSupply);
  }, [token, totalSupply]);

  const totalBalance = useMemo(() => {
    return accounts.reduce((total, account) => {
      if (account.type !== "TokenAccount") return total;
      if (account.token.id !== token.id) return total;

      return total.plus(account.spendableBalance);
    }, BigNumber(0));
  }, [token.id, accounts]);

  return (
    <RowContent>
      <Box>
        <CryptoCurrencyIcon currency={token} size={32} />
        <RowAccount>
          <ToolTip content={token.name} delay={1200}>
            <Ellipsis ff="Inter|SemiBold" color="palette.text.shade100" fontSize={14}>
              {token.ticker}
            </Ellipsis>
          </ToolTip>
        </RowAccount>
      </Box>
      <Amount>
        <Ellipsis>
          <FormattedVal
            color="palette.text.shade100"
            unit={token.units[0]}
            val={totalBalance}
            fontSize={4}
            ff="Inter|SemiBold"
            showCode
          />
        </Ellipsis>
      </Amount>
      <Amount>
        {/* TODO: Rework when countervalues api is merged */}
        <Ellipsis fontSize={4} ff="Inter|SemiBold" color="palette.text.shade100">
          {grossSupply}
        </Ellipsis>
      </Amount>
      <Amount style={{ alignItems: "center" }}>
        <Pill>{supplyAPY}</Pill>
      </Amount>
      <Action>
        <CompactButton fontSize={3} primary onClick={openManageModal}>
          {t("lend.lendAsset")}
        </CompactButton>
      </Action>
    </RowContent>
  );
};

const Rates = ({ rates }: { rates: CurrentRate[] }) => {
  const { t } = useTranslation();
  const accounts = useSelector(flattenSortAccountsSelector);
  return (
    <Card>
      <Header px={24} py={16} horizontal flex>
        <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3}>
          {t("lend.headers.rates.allAssets")}
        </Text>
        <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3}>
          {t("lend.headers.rates.totalBalance")}
        </Text>
        <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3}>
          {t("lend.headers.rates.grossSupply")}
        </Text>
        <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3}>
          {t("lend.headers.rates.currentAPY")}
        </Text>
        <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3}>
          {t("lend.headers.rates.actions")}
        </Text>
      </Header>
      {rates.map(r => (
        <Row data={r} key={r.ctoken.id} accounts={accounts} />
      ))}
    </Card>
  );
};

export default Rates;
