// @flow
import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { BigNumber } from "bignumber.js";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import type { AccountLikeArray } from "@ledgerhq/live-common/lib/types";
import type { CurrentRate } from "@ledgerhq/live-common/lib/families/ethereum/modules/compound";
import { getCryptoCurrencyById, formatShort } from "@ledgerhq/live-common/lib/currencies";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { useFlattenSortAccounts } from "~/renderer/actions/general";
import { isAcceptedLendingTerms } from "~/renderer/terms";
import Box from "~/renderer/components/Box";
import Card from "~/renderer/components/Box/Card";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import Ellipsis from "~/renderer/components/Ellipsis";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import ToolTip from "~/renderer/components/Tooltip";
import FormattedVal from "~/renderer/components/FormattedVal";
import InfoCircle from "~/renderer/icons/InfoCircle";
import { openModal } from "~/renderer/actions/modals";
import Pill from "./Pill";

const Header = styled(Box)`
  border-bottom: 1px solid ${p => p.theme.colors.palette.divider};
  align-items: center;

  > * {
    flex-basis: 20%;
    align-items: center;
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

const IconWrapper = styled.div`
  margin-left: 4px;
`;

const Row = ({ data, accounts }: { data: CurrentRate, accounts: AccountLikeArray }) => {
  const { token, totalSupply, supplyAPY } = data;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const eth = getCryptoCurrencyById("ethereum");

  const openManageModal = useCallback(() => {
    const account = accounts.find(a => a.type === "TokenAccount" && a.token.id === token.id);
    const parentAccount = accounts.find(a => account?.parentId === a.id);
    const ethAccount = accounts.find(a => a.type === "Account" && a.currency.id === eth.id);
    if (!account && ethAccount) {
      dispatch(
        openModal("MODAL_LEND_EMPTY_ACCOUNT_DEPOSIT", { currency: token, account: ethAccount }),
      );
    } else if (!ethAccount) {
      dispatch(openModal("MODAL_LEND_NO_ETHEREUM_ACCOUNT", { currency: token }));
    } else if (isAcceptedLendingTerms()) {
      dispatch(
        openModal("MODAL_LEND_SELECT_ACCOUNT", {
          account,
          parentAccount,
          currency: token,
          nextStep: "MODAL_LEND_ENABLE_FLOW",
        }),
      );
    } else {
      dispatch(openModal("MODAL_LEND_ENABLE_INFO", { account, parentAccount, currency: token }));
    }
  }, [dispatch, accounts, token, eth]);

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

  const event = useMemo(() => {
    const ethAccount = accounts.find(a => a.type === "Account" && a.currency.id === eth.id);
    return {
      name: !ethAccount ? "Lend Deposit NoAccount" : "Lend Deposit",
      eventProperties: !ethAccount ? {} : { currencyName: token.name },
    };
  }, [accounts, token, eth]);

  return (
    <RowContent>
      <Box>
        <CryptoCurrencyIcon circle currency={token} size={32} />
        <RowAccount>
          <ToolTip content={token.name} delay={1200}>
            <Ellipsis ff="Inter|SemiBold" color="palette.text.shade100" fontSize={14}>
              {token.name}
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
        <Ellipsis fontSize={4} ff="Inter|SemiBold" color="palette.text.shade100">
          {grossSupply}
        </Ellipsis>
      </Amount>
      <Amount style={{ alignItems: "center" }}>
        <Pill fontSize={4}>{supplyAPY}</Pill>
      </Amount>
      <Action>
        <CompactButton
          fontSize={3}
          primary
          onClick={openManageModal}
          event={event.name}
          eventProperties={event.eventProperties}
        >
          {t("lend.lendAsset")}
        </CompactButton>
      </Action>
    </RowContent>
  );
};

export default function Rates({ rates }: { rates: CurrentRate[] }) {
  const { t } = useTranslation();
  const accounts = useFlattenSortAccounts();
  return (
    <Card>
      <Header px={24} py={16} horizontal flex>
        <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3}>
          {t("lend.headers.rates.allAssets")}
        </Text>
        <Box horizontal>
          <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3}>
            {t("lend.headers.rates.totalBalance")}
          </Text>
          <ToolTip content={t("lend.headers.rates.totalBalanceTooltip")}>
            <IconWrapper>
              <InfoCircle size={11} />
            </IconWrapper>
          </ToolTip>
        </Box>
        <Box horizontal>
          <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3}>
            {t("lend.headers.rates.grossSupply")}
          </Text>
          <ToolTip content={t("lend.headers.rates.grossSupplyTooltip")}>
            <IconWrapper>
              <InfoCircle size={11} />
            </IconWrapper>
          </ToolTip>
        </Box>
        <Box horizontal>
          <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3}>
            {t("lend.headers.rates.currentAPY")}
          </Text>
          <ToolTip content={t("lend.headers.rates.currentAPYTooltip")}>
            <IconWrapper>
              <InfoCircle size={11} />
            </IconWrapper>
          </ToolTip>
        </Box>
        <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3}>
          {t("lend.headers.rates.actions")}
        </Text>
      </Header>
      {rates.map(r => (
        <Row data={r} key={r.ctoken.id} accounts={accounts} />
      ))}
    </Card>
  );
}
