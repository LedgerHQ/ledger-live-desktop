// @flow

import React, { useCallback } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";

import type { AccountLike, Account } from "@ledgerhq/live-common/lib/types";
import {
  getDefaultExplorerView,
  getAccountContractExplorer,
} from "@ledgerhq/live-common/lib/explorers";
import {
  getAccountCurrency,
  getMainAccount,
  shortAddressPreview,
} from "@ledgerhq/live-common/lib/account/helpers";

import Box from "~/renderer/components/Box";
import Ellipsis from "~/renderer/components/Ellipsis";
import Text from "~/renderer/components/Text";
import ExternalLink from "~/renderer/icons/ExternalLink";
import { openURL } from "~/renderer/linking";
import IconInfoCircle from "~/renderer/icons/InfoCircle";
import ParentCryptoCurrencyIcon from "~/renderer/components/ParentCryptoCurrencyIcon";

const CurNameToken = styled(Text).attrs(() => ({
  ff: "Inter|Bold",
  fontSize: 2,
}))``;

const CurNameTokenLink = styled(CurNameToken)`
  margin-left: 5px;
  padding: 2px 4px;
  border-radius: ${p => p.theme.radii[1]}px;
`;

const CurNameTokenIcon = styled(Text).attrs(() => ({
  ff: "Inter|SemiBold",
  fontSize: 2,
}))`
  color: ${p => p.theme.colors.wallet};
  display: none;
  margin-left: 5px;
  align-items: center;
`;

const Wrapper = styled(Box)`
  cursor: pointer;
  display: flex;
  align-items: center;

  :hover ${CurNameTokenIcon} {
    display: flex;
  }

  :hover ${CurNameTokenLink} {
    color: ${p => p.theme.colors.wallet};
    background-color: ${p => p.theme.colors.pillActiveBackground};
  }
`;

const AccountName = styled(Text).attrs(() => ({
  color: "palette.text.shade100",
  ff: "Inter|SemiBold",
  fontSize: 7,
}))`
  line-height: 1.1;
`;

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
};

const AssetHeader: React$ComponentType<Props> = React.memo(function AssetHeader({
  account,
  parentAccount,
}: Props) {
  const currency = getAccountCurrency(account);
  const mainAccount = getMainAccount(account, parentAccount);
  const explorerView = getDefaultExplorerView(mainAccount.currency);

  const getContract = () =>
    account.type === "TokenAccount" && parentAccount
      ? getAccountContractExplorer(explorerView, account, parentAccount)
      : null;

  const contract = getContract();

  const openLink = useCallback(() => {
    if (contract) {
      openURL(contract);
    }
  }, [contract]);

  return (
    <Box horizontal alignItems="center" flow={2} grow>
      <Box>
        <ParentCryptoCurrencyIcon currency={currency} bigger />
      </Box>
      <Box grow>
        {contract && account.type === "TokenAccount" ? (
          <Box horizontal alignItems="center">
            <CurNameToken>
              <Trans i18nKey="account.contractAddress" />
            </CurNameToken>
            <Wrapper horizontal alignItems="center" onClick={openLink}>
              <CurNameTokenLink>
                {shortAddressPreview(account.token.contractAddress)}
              </CurNameTokenLink>
              <CurNameTokenIcon>
                <ExternalLink size={12} style={{ marginRight: 5 }} />
                <Trans i18nKey="account.openInExplorer" />
              </CurNameTokenIcon>
            </Wrapper>
          </Box>
        ) : null}
        <AccountName>
          <Ellipsis>{currency.name}</Ellipsis>
        </AccountName>
      </Box>
      <IconInfoCircle size={14} />
      <Text ff="Inter|SemiBold" fontSize={12} style={{ marginLeft: 8 }}>
        <Trans i18nKey="asset.notice" values={{ currency: currency.name }} />
      </Text>
    </Box>
  );
});

export default AssetHeader;
