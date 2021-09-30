// @flow
import React, { useCallback, useState, memo } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { listSubAccounts } from "@ledgerhq/live-common/lib/account/helpers";
import { listTokenTypesForCryptoCurrency } from "@ledgerhq/live-common/lib/currencies";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types/account";
import { openModal } from "~/renderer/actions/modals";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import IconPlus from "~/renderer/icons/Plus";
import TokenRow from "~/renderer/components/TokenRow";
import Button from "~/renderer/components/Button";
import { supportLinkByTokenType } from "~/config/urls";
import LabelWithExternalIcon from "~/renderer/components/LabelWithExternalIcon";
import { openURL } from "~/renderer/linking";
import { track } from "~/renderer/analytics/segment";
import AccountContextMenu from "~/renderer/components/ContextMenu/AccountContextMenu";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import perFamilyTokenList from "~/renderer/generated/TokenList";
import { useTimeRange } from "~/renderer/actions/settings";
import TableContainer, { TableHeader } from "~/renderer/components/TableContainer";
import AngleDown from "~/renderer/icons/AngleDown";

type Props = {
  account: Account,
};

export default memo<Props>(TokensList);

function TokensList({ account }: Props) {
  const { t } = useTranslation();
  const [range] = useTimeRange();
  const dispatch = useDispatch();
  const history = useHistory();

  const onAccountClick = useCallback(
    (account: AccountLike, parentAccount: Account) => {
      history.push({
        pathname: `/account/${parentAccount.id}/${account.id}`,
        state: { source: "tokens list" },
      });
    },
    [history],
  );

  const onReceiveClick = useCallback(() => {
    dispatch(openModal("MODAL_RECEIVE", { account, receiveTokenMode: true }));
  }, [dispatch, account]);

  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapse = useCallback(() => setCollapsed(s => !s), []);

  if (!account.subAccounts) return null;
  const subAccounts = listSubAccounts(account);
  const { currency } = account;
  const family = currency.family;
  const tokenTypes = listTokenTypesForCryptoCurrency(currency);
  const isTokenAccount = tokenTypes.length > 0;
  const isEmpty = subAccounts.length === 0;
  const shouldSliceList = subAccounts.length >= 5;

  if (!isTokenAccount && isEmpty) return null;

  const url =
    currency && currency.type !== "TokenCurrency" && tokenTypes && tokenTypes.length > 0
      ? supportLinkByTokenType[tokenTypes[0]]
      : null;

  const specific = perFamilyTokenList[family];
  const hasSpecificTokenWording = specific?.hasSpecificTokenWording;
  const ReceiveButtonComponent = specific?.ReceiveButton ?? ReceiveButton;

  const titleLabel = t(hasSpecificTokenWording ? `tokensList.${family}.title` : "tokensList.title");
  const placeholderLabel = t(
    hasSpecificTokenWording ? `tokensList.${family}.placeholder` : "tokensList.placeholder",
    {
      currencyName: currency.name,
    },
  );

  const linkLabel = t(hasSpecificTokenWording ? `tokensList.${family}.link` : "tokensList.link");

  const translationMap = {
    see: hasSpecificTokenWording
      ? `tokensList.${currency.family}.seeTokens`
      : `tokensList.seeTokens`,
    hide: hasSpecificTokenWording
      ? `tokensList.${currency.family}.hideTokens`
      : `tokensList.hideTokens`,
  };

  return (
    <TableContainer id="tokens-list" mb={50}>
      <TableHeader title={isTokenAccount ? titleLabel : t("subAccounts.title")}>
        {!isEmpty && isTokenAccount && (
          <ReceiveButtonComponent onClick={onReceiveClick} account={account} />
        )}
      </TableHeader>
      {isEmpty && (
        <EmptyState>
          <Placeholder>
            {url ? (
              <Text color="palette.text.shade80" ff="Inter|SemiBold" fontSize={4}>
                {placeholderLabel}
                &nbsp;
                <LabelWithExternalIcon
                  color="wallet"
                  ff="Inter|SemiBold"
                  onClick={() => {
                    if (url) {
                      openURL(url);
                      track(`More info on Manage ${tokenTypes[0]} tokens`);
                    }
                  }}
                  label={linkLabel}
                />
              </Text>
            ) : null}
          </Placeholder>
          <ReceiveButtonComponent onClick={onReceiveClick} account={account} />
        </EmptyState>
      )}
      {subAccounts
        .slice(0, shouldSliceList && collapsed ? 3 : subAccounts.length)
        .map((token, index) => (
          <AccountContextMenu key={token.id} account={token} parentAccount={account}>
            <TokenRow
              index={index}
              range={range}
              account={token}
              parentAccount={account}
              onClick={onAccountClick}
              disableRounding
            />
          </AccountContextMenu>
        ))}
      {shouldSliceList && (
        <TokenShowMoreIndicator expanded={!collapsed} onClick={toggleCollapse}>
          <Box horizontal alignContent="center" justifyContent="center">
            <Text color="wallet" ff="Inter|SemiBold" fontSize={4}>
              {t(translationMap[collapsed ? "see" : "hide"], { tokenCount: subAccounts.length })}
            </Text>
            <IconAngleDown expanded={!collapsed}>
              <AngleDown size={16} />
            </IconAngleDown>
          </Box>
        </TokenShowMoreIndicator>
      )}
    </TableContainer>
  );
}

// Fixme Temporarily hiding the receive token button
function ReceiveButton(props: { onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <Button small primary onClick={props.onClick}>
      <Box horizontal flow={1} alignItems="center">
        <IconPlus size={12} />
        <Box>{t("tokensList.cta")}</Box>
      </Box>
    </Button>
  );
}

const EmptyState: ThemedComponent<{}> = styled.div`
  padding: 15px 20px;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  > :first-child {
    flex: 1;
  }
  > :nth-child(2) {
    align-self: center;
  }
`;

const Placeholder: ThemedComponent<{}> = styled.div`
  flex-direction: column;
  display: flex;
  padding-right: 50px;
`;

export const TokenShowMoreIndicator: ThemedComponent<{ expanded?: boolean }> = styled(Button)`
  display: flex;
  color: ${p => p.theme.colors.wallet};
  align-items: center;
  justify-content: center;
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  background: ${p => p.theme.colors.palette.background.paper};
  border-radius: 0px 0px 4px 4px;
  height: 44px;
  text-align: center;
  padding: 0;
  &:hover ${Text} {
    text-decoration: underline;
  }
  &:hover {
    background-color: initial;
  }
  > :nth-child(2) {
    margin-left: 8px;
    transform: rotate(${p => (p.expanded ? "180deg" : "0deg")});
  }
`;

export const IconAngleDown: ThemedComponent<{ expanded?: boolean }> = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: ${p => (p.expanded ? "rotate(180deg)" : "rotate(0deg)")};
`;
