// @flow

import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getAccountName } from "@ledgerhq/live-common/lib/account";
import type { CompoundAccountSummary } from "@ledgerhq/live-common/lib/compound/types";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";
import Card from "~/renderer/components/Box/Card";
import Text from "~/renderer/components/Text";
import Ellipsis from "~/renderer/components/Ellipsis";
import CounterValue from "~/renderer/components/CounterValue";
import FormattedVal from "~/renderer/components/FormattedVal";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import ToolTip from "~/renderer/components/Tooltip";
import ChevronRight from "~/renderer/icons/ChevronRight";
import { StatusPill } from "./Pill";

import { openModal } from "~/renderer/actions/modals";

const Header = styled(Box)`
  border-bottom: 1px solid ${p => p.theme.colors.palette.divider};

  > * {
    flex-basis: 25%;
  }

  > *:nth-child(2),
  > *:nth-child(3) {
    flex-basis: 20%;
  }

  > *:nth-child(4) {
    text-align: center;
  }

  > *:last-child {
    flex-basis: 10%;
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
  flex-basis: 25%;
  justify-content: center;
`;

const Action: ThemedComponent<{}> = styled.div`
  flex-basis: 10%;
  justify-content: flex-end;
  cursor: pointer;
  color: ${p => p.theme.colors.palette.text.shade50};
`;

type RowProps = {
  summary: CompoundAccountSummary,
};

const Row = ({ summary }: RowProps) => {
  const { account, parentAccount, totalSupplied, accruedInterests } = summary;
  const { token } = account;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const name = getAccountName(account);

  // START HACK
  // TODO: Remove this when we have a working implementation
  // of statuses in live-commmon
  const [status, setStatus] = useState("");

  useEffect(() => {
    const rand = Math.round(Math.random() * 4);
    const s =
      rand === 0 ? "ENABLING" : rand === 1 ? "TO_SUPPLY" : rand === 2 ? "SUPPLYING" : "SUPPLIED";
    setStatus(s);
  }, []);

  const openManageModal = useCallback(() => {
    dispatch(openModal("MODAL_LEND_MANAGE", { ...summary }));
  }, [dispatch, summary]);

  // END HACK

  return (
    <RowContent>
      <Box>
        <CryptoCurrencyIcon currency={token} size={32} />
        <RowAccount>
          <Ellipsis fontSize={10} color="palette.text.shade50">
            <Text ff="Inter|SemiBold">{parentAccount.name}</Text>
          </Ellipsis>
          <ToolTip content={name} delay={1200}>
            <Ellipsis ff="Inter|SemiBold" color="palette.text.shade100" fontSize={14}>
              {name}
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
      <Status>{status ? <StatusPill type={status} /> : null}</Status>
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
        <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3}>
          {t("lend.headers.active.amountSupplied")}
        </Text>
        <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3}>
          {t("lend.headers.active.accruedInterests")}
        </Text>
        <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3}>
          {t("lend.headers.active.status")}
        </Text>
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
