// @flow

import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import moment from "moment";
import { Trans } from "react-i18next";
import {
  getMainAccount,
  getAccountUnit,
  getAccountCurrency,
  shortAddressPreview,
} from "@ledgerhq/live-common/lib/account";
import {
  getDefaultExplorerView,
  getTransactionExplorer,
  getAddressExplorer,
} from "@ledgerhq/live-common/lib/explorers";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import type { Delegation } from "@ledgerhq/live-common/lib/families/tezos/bakers";
import { openURL } from "~/renderer/linking";
import CounterValue from "~/renderer/components/CounterValue";
import FormattedVal from "~/renderer/components/FormattedVal";
import Text from "~/renderer/components/Text";
import Ellipsis from "~/renderer/components/Ellipsis";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import BakerImage from "../BakerImage";
import ContextMenu from "./ContextMenu";

type Props = {
  delegation: Delegation,
  account: AccountLike,
  parentAccount: ?Account,
};

const Wrapper: ThemedComponent<{ isPending: boolean }> = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 20px;
  opacity: ${p => (p.isPending ? 0.5 : 1)};
  > * {
    display: flex;
    align-items: center;
    flex-direction: row;
    box-sizing: border-box;
  }
`;

const Baker = styled.div`
  flex: 1.5;
  color: ${p => p.theme.colors.palette.text.shade100};
  > :first-child {
    margin-right: 6px;
    border-radius: 50%;
  }

  > :nth-child(2),
  > :only-child {
    padding-right: 8px;
  }

  cursor: pointer;
`;

const Address = styled.div`
  user-select: pointer;
  flex: 1.5;
  > :first-child {
    margin-right: 8px;
  }
`;

const Base = styled.div`
  flex: 1;
  > :first-child {
    margin-right: 6px;
  }
`;

const CTA = styled.div`
  flex: 0.5;
  display: flex;
  justify-content: flex-end;
`;

const Row = ({ account, parentAccount, delegation }: Props) => {
  const unit = getAccountUnit(account);
  const currency = getAccountCurrency(account);

  const mainAccount = getMainAccount(account, parentAccount);

  const name = delegation.baker ? delegation.baker.name : shortAddressPreview(delegation.address);

  const diffInDays = useMemo(() => moment().diff(delegation.operation.date, "days"), [
    delegation.operation.date,
  ]);

  const explorerView = getDefaultExplorerView(mainAccount.currency);
  const bakerURL = getAddressExplorer(explorerView, delegation.address);
  const txURL = getTransactionExplorer(explorerView, delegation.operation.hash);

  const openBaker = useCallback(() => {
    if (bakerURL) openURL(bakerURL);
  }, [bakerURL]);

  const openTx = useCallback(() => {
    if (txURL) openURL(txURL);
  }, [txURL]);

  return (
    <Wrapper isPending={delegation.isPending}>
      <Baker onClick={openBaker}>
        <BakerImage baker={delegation.baker} />
        <Ellipsis ff="Inter|SemiBold" color="palette.text.shade100" fontSize={3}>
          {name}
        </Ellipsis>
      </Baker>
      <Address onClick={openTx}>
        <Text ff="Inter|Medium" color="palette.primary.main" fontSize={3}>
          {shortAddressPreview(delegation.operation.hash)}
        </Text>
      </Address>
      <Base>
        <FormattedVal
          ff="Inter|SemiBold"
          val={account.balance}
          unit={unit}
          showCode
          fontSize={3}
          color="palette.text.shade80"
        />
      </Base>
      <Base>
        <CounterValue
          ff="Inter|SemiBold"
          color="palette.text.shade80"
          fontSize={3}
          currency={currency}
          value={account.balance}
        />
      </Base>
      <Base>
        <Text ff="Inter|Medium" color="palette.text.shade80" fontSize={3}>
          {diffInDays ? (
            <Trans
              i18nKey="delegation.durationDays"
              count={diffInDays}
              values={{ count: diffInDays }}
            />
          ) : (
            <Trans i18nKey="delegation.durationJustStarted" />
          )}
        </Text>
      </Base>
      {account.type === "Account" && !delegation.isPending ? (
        <CTA>
          <ContextMenu account={account} parentAccount={parentAccount} />
        </CTA>
      ) : (
        <CTA />
      )}
    </Wrapper>
  );
};

export default Row;
