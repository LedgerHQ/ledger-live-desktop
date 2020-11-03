// @flow

import React, { useCallback } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getAccountCurrency, getAccountName } from "@ledgerhq/live-common/lib/account";
import type { CompoundAccountSummary } from "@ledgerhq/live-common/lib/compound/types";
import { getAccountCapabilities } from "@ledgerhq/live-common/lib/compound/logic";
import { useHistory } from "react-router-dom";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";
import Card from "~/renderer/components/Box/Card";
import Text from "~/renderer/components/Text";
import Ellipsis from "~/renderer/components/Ellipsis";
import CounterValue from "~/renderer/components/CounterValue";
import FormattedVal from "~/renderer/components/FormattedVal";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import InfoCircle from "~/renderer/icons/InfoCircle";
import ToolTip from "~/renderer/components/Tooltip";
import ChevronRight from "~/renderer/icons/ChevronRight";
import { StatusPill } from "./Pill";

import { openModal } from "~/renderer/actions/modals";

const Header = styled(Box)`
  border-bottom: 1px solid ${p => p.theme.colors.palette.divider};
  align-items: center;

  > * {
    flex-basis: 25%;
    align-items: center;
  }

  > *:nth-child(2),
  > *:nth-child(3) {
    flex-basis: 20%;
  }

  > *:nth-child(4) {
    flex-basis: 15%;
    justify-content: center;
  }

  > *:last-child {
    flex-basis: 20%;
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
    flex-basis: 25%;
    display: flex;
    align-items: center;
    flex-direction: row;
    box-sizing: border-box;
    max-width: 25%;
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
  flex-basis: 20%;
  max-width: 20%;
`;

const Status = styled(Box)`
  flex-basis: 15%;
  justify-content: center;
`;

const Action: ThemedComponent<{}> = styled.div`
  flex-basis: 20%;
  justify-content: flex-end;
  cursor: pointer;
  color: ${p => p.theme.colors.palette.text.shade50};
`;

const IconWrapper = styled.div`
  margin-left: 4px;
`;

type RowProps = {
  summary: CompoundAccountSummary,
};

const Row = ({ summary }: RowProps) => {
  const { account, parentAccount, totalSupplied, accruedInterests } = summary;
  const { token } = account;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const name = getAccountName(account);
  const currency = getAccountCurrency(account);
  const capabilities = getAccountCapabilities(account);

  const openManageModal = useCallback(() => {
    dispatch(openModal("MODAL_LEND_MANAGE", { ...summary }));
  }, [dispatch, summary]);

  const openAccountPage = useCallback(() => {
    if (!parentAccount || !account) return;
    history.push(`/account/${parentAccount.id}/${account.id}`);
  }, [history, parentAccount, account]);

  if (!summary) return null;

  return (
    <RowContent>
      <Box onClick={openAccountPage}>
        <CryptoCurrencyIcon currency={token} size={32} />
        <RowAccount>
          <Ellipsis fontSize={10} color="palette.text.shade50">
            <Text ff="Inter|SemiBold">{parentAccount?.name || name}</Text>
          </Ellipsis>
          <ToolTip content={name} delay={1200}>
            <Ellipsis ff="Inter|SemiBold" color="palette.text.shade100" fontSize={14}>
              {currency.name}
            </Ellipsis>
          </ToolTip>
        </RowAccount>
      </Box>
      <Amount>
        <Ellipsis ff="Inter|SemiBold">
          <FormattedVal
            color="palette.text.shade100"
            unit={token.units[0]}
            val={totalSupplied}
            fontSize={4}
            showCode
          />
        </Ellipsis>
        <Ellipsis ff="Inter|Medium">
          <CounterValue
            currency={token}
            value={totalSupplied}
            disableRounding
            color="palette.text.shade50"
            fontSize={3}
            showCode
            alwaysShowSign={false}
          />
        </Ellipsis>
      </Amount>
      <Amount>
        <Ellipsis ff="Inter|SemiBold">
          <FormattedVal
            color="palette.text.shade100"
            unit={token.units[0]}
            val={accruedInterests}
            fontSize={4}
            showCode
          />
        </Ellipsis>
        <Ellipsis ff="Inter|Medium">
          <CounterValue
            currency={token}
            value={accruedInterests}
            disableRounding
            color="palette.text.shade50"
            fontSize={3}
            showCode
            alwaysShowSign={false}
          />
        </Ellipsis>
      </Amount>
      <Status>{capabilities?.status ? <StatusPill type={capabilities.status} /> : null}</Status>
      <Action onClick={openManageModal}>
        <Box flex horizontal alignItems="center">
          <Text ff="Inter|SemiBold" fontSize={4} color="palette.text.shade50">
            {t("common.manage")}
          </Text>
          <div style={{ transform: "rotate(90deg)" }}>
            <ChevronRight size={16} />
          </div>
        </Box>
      </Action>
    </RowContent>
  );
};

type Props = {
  summaries: CompoundAccountSummary[],
};

const ActiveAccounts = ({ summaries }: Props) => {
  const { t } = useTranslation();

  return (
    <Card>
      <Header px={24} py={16} horizontal flex>
        <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3}>
          {t("lend.headers.active.accounts")}
        </Text>
        <Box horizontal>
          <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3}>
            {t("lend.headers.active.amountSupplied")}
          </Text>
          <ToolTip content={t("lend.headers.active.amountSuppliedTooltip")}>
            <IconWrapper>
              <InfoCircle size={11} />
            </IconWrapper>
          </ToolTip>
        </Box>
        <Box horizontal>
          <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3}>
            {t("lend.headers.active.accruedInterests")}
          </Text>
          <ToolTip content={t("lend.headers.active.accruedInterestsTooltip")}>
            <IconWrapper>
              <InfoCircle size={11} />
            </IconWrapper>
          </ToolTip>
        </Box>
        <Box horizontal>
          <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3}>
            {t("lend.headers.active.status")}
          </Text>
          <ToolTip content={t("lend.headers.active.statusTooltip")}>
            <IconWrapper>
              <InfoCircle size={11} />
            </IconWrapper>
          </ToolTip>
        </Box>
        <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3}>
          {t("lend.headers.active.actions")}
        </Text>
      </Header>
      {summaries.map(s => (
        <Row key={s.account.id} summary={s} />
      ))}
    </Card>
  );
};

export default ActiveAccounts;
