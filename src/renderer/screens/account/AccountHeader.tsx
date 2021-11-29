import React, { useCallback, useState, useEffect } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { useDispatch } from "react-redux";

import { AccountLike, Account } from "@ledgerhq/live-common/lib/types";
import { Button, Text, Flex, Icons } from "@ledgerhq/react-ui";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";
import {
  getDefaultExplorerView,
  getAccountContractExplorer,
} from "@ledgerhq/live-common/lib/explorers";
import {
  getAccountCurrency,
  getMainAccount,
  shortAddressPreview,
  getAccountName,
} from "@ledgerhq/live-common/lib/account";
import { openURL } from "~/renderer/linking";
import ParentCryptoCurrencyIcon from "~/renderer/components/ParentCryptoCurrencyIcon";
import { updateAccount } from "~/renderer/actions/accounts";
import AccountTagDerivationMode from "~/renderer/components/AccountTagDerivationMode";
import { noop } from "lodash";

const Subtitle = styled(Text).attrs(() => ({
  variant: "paragraph",
  fontWeight: "medium",
  color: "palette.neutral.c70",
}))``;

const TokenContractLink = styled(Subtitle)`
  margin: 0px 4px;
  border-radius: ${p => p.theme.radii[1]}px;
`;

const TokenContractLinkWrapper = styled(Flex)`
  cursor: pointer;
  display: flex;
  align-items: center;

  > svg {
    display: none;
    margin-top: -3px;
  }

  :hover > svg {
    display: inline;
  }

  :hover ${TokenContractLink} {
    color: ${p => p.theme.colors.palette.neutral.c100};
    text-decoration: underline;
  }
`;

const AccountNameBox = styled(Flex)`
  width: 100%;
  position: relative;
  left: -11px;
`;

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const AccountName: ThemedComponent<InputProps & { disabled?: boolean }> = styled(Text).attrs(
  () => ({
    variant: "h5",
    fontWeight: "medium",
    color: "palette.neutral.c100",
    fontSize: "20px", // the variant isn't enough
  }),
)`
  border: 1px solid;
  border-color: transparent;
  border-radius: 4px;
  padding: 1px 9px 2px;
  max-width: 250px !important;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  background-color: transparent;

  + svg {
    display: none;
  }

  :hover {
    border-color: ${p => (!p.disabled ? p.theme.colors.palette.neutral.c70 : "transparent")};
    cursor: text;

    + svg {
      display: ${p => (!p.disabled ? "inline" : "none")};
    }
  }

  :focus {
    max-width: 190px !important;
    border-color: ${p => p.theme.colors.palette.neutral.c100};

    + svg {
      display: none;
    }
  }
`;

const InputButtonsContainer = styled(Flex).attrs(() => ({
  position: "absolute",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  top: 0,
  bottom: 0,
}))``;

type Props = {
  account: AccountLike;
  parentAccount: Account;
};

const AccountHeader: React$ComponentType<Props> = React.memo(function AccountHeader({
  account,
  parentAccount,
}: Props) {
  const dispatch = useDispatch();

  const [name, setName] = useState(getAccountName(account));
  const [editingName, setEditingName] = useState(false);

  const currency = getAccountCurrency(account);
  const mainAccount = getMainAccount(account, parentAccount);
  const explorerView = getDefaultExplorerView(mainAccount.currency);

  const getContract = () =>
    account.type === "TokenAccount" && parentAccount
      ? getAccountContractExplorer(explorerView, account, parentAccount)
      : null;

  const submitNameChange = () => {
    if (account.type === "Account") {
      const updatedAccount: Account = {
        ...account,
        name,
      };

      dispatch(updateAccount(updatedAccount));
    }
  };

  const submitNameChangeOnEnter = e => {
    if (e.key === "Enter") {
      e.target.blur();
      submitNameChange();
    }
  };

  const contract = getContract();

  const openLink = useCallback(() => {
    if (contract) {
      openURL(contract);
    }
  }, [contract]);

  useEffect(() => {
    if (!editingName) {
      setName(getAccountName(account));
    }
  }, [editingName, account]);

  return (
    <Flex flexDirection="row" flexShrink={1} alignItems="center">
      <ParentCryptoCurrencyIcon currency={currency} size={10} />
      <Flex flex={1} flexDirection="column" alignItems="flex-start" ml={6}>
        <AccountNameBox alignItems="center" columnGap={3}>
          <AccountName
            disabled={account.type !== "Account"}
            onFocus={() => {
              setEditingName(true);
              setTimeout(() => {
                document.execCommand("selectAll", false, null);
              });
            }}
            onBlur={() => {
              setEditingName(false);
              setTimeout(() => {
                window.getSelection().removeAllRanges();
              });
            }}
            onKeyPress={submitNameChangeOnEnter}
            onChange={e => setName(e.target.value)}
            disableEllipsis={editingName}
            value={name}
            id="account-header-name"
            as="input"
          />
          <Icons.PenMedium size={20} color="palette.neutral.c70" />
          {editingName && (
            <div style={{ position: "relative" }}>
              <InputButtonsContainer columnGap={3}>
                <Button Icon={Icons.CloseMedium} variant="shade" outline onClick={noop} />
                <Button Icon={Icons.CheckAloneMedium} variant="main" onClick={submitNameChange} />
              </InputButtonsContainer>
            </div>
          )}
        </AccountNameBox>
        {contract && account.type === "TokenAccount" ? (
          <Flex flexDirection="row" alignItems="center">
            <Subtitle>
              <Trans i18nKey="account.contractAddress" />
            </Subtitle>
            <TokenContractLinkWrapper horizontal onClick={openLink}>
              <TokenContractLink>
                {shortAddressPreview(account.token.contractAddress)}
              </TokenContractLink>
              <Icons.ExternalLinkMedium size={16} color="palette.neutral.c100" />
            </TokenContractLinkWrapper>
          </Flex>
        ) : (
          <Subtitle uppercase>
            {currency.name} <AccountTagDerivationMode account={account} />
          </Subtitle>
        )}
      </Flex>
    </Flex>
  );
});

export default AccountHeader;
