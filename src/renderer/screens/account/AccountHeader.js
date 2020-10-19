// @flow

import React, { useCallback, useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { connect } from "react-redux";

import type { AccountLike, Account } from "@ledgerhq/live-common/lib/types";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
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
import Box, { Tabbable } from "~/renderer/components/Box";
import Ellipsis from "~/renderer/components/Ellipsis";
import Text from "~/renderer/components/Text";
import ExternalLink from "~/renderer/icons/ExternalLink";
import { openURL } from "~/renderer/linking";
import { colors } from "~/renderer/styles/theme";
import { rgba } from "~/renderer/styles/helpers";
import ParentCryptoCurrencyIcon from "~/renderer/components/ParentCryptoCurrencyIcon";
import IconPen from "~/renderer/icons/Pen";
import IconCross from "~/renderer/icons/Cross";
import IconCheck from "~/renderer/icons/Check";
import { updateAccount } from "~/renderer/actions/accounts";

const CurName = styled(Text).attrs(() => ({
  ff: "Inter|SemiBold",
  fontSize: 2,
}))`
  text-transform: uppercase;
  letter-spacing: 1px;
`;

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
  color: ${colors.wallet};
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
    color: ${colors.wallet};
    background-color: ${colors.pillActiveBackground};
  }
`;

const AccountNameBox = styled(Box)`
  position: relative;
  left: -11px;
`;

const AccountName = styled(Ellipsis)`
  border: 1px solid;
  border-color: transparent;
  border-radius: 4px;
  padding: 1px 9px 2px;
  max-width: 250px !important;

  + svg {
    display: none;
  }

  :hover {
    border-color: ${p => p.theme.colors.palette.text.shade30};

    + svg {
      display: inline;
    }
  }
  :focus {
    border-color: ${p => p.theme.colors.wallet};
    background: #fff;
    width: 250px;

    + svg {
      display: none;
    }
  }
`;

const IconButton: ThemedComponent<{ disabled?: boolean }> = styled(Tabbable).attrs(() => ({
  alignItems: "center",
  justifyContent: "center",
}))`
  width: 34px;
  height: 34px;
  border: 1px solid ${p => p.theme.colors.palette.text.shade60};
  border-radius: 4px;
  &:hover {
    color: ${p => (p.disabled ? "" : p.theme.colors.palette.text.shade100)};
    background: ${p => (p.disabled ? "" : rgba(p.theme.colors.palette.divider, 0.2))};
    border-color: ${p => p.theme.colors.palette.text.shade100};
  }

  &:active {
    background: ${p => (p.disabled ? "" : rgba(p.theme.colors.palette.divider, 0.3))};
  }
`;

const mapDispatchToProps = {
  updateAccount,
};

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
  updateAccount: Function,
};

const AccountHeader: React$ComponentType<Props> = React.memo(function AccountHeader({
  account,
  parentAccount,
  updateAccount,
}: Props) {
  const [editingName, setEditingName] = useState(false);

  const nameEl = useRef(null);

  const currency = getAccountCurrency(account);
  const mainAccount = getMainAccount(account, parentAccount);
  const explorerView = getDefaultExplorerView(mainAccount.currency);

  const getContract = () =>
    account.type === "TokenAccount" && parentAccount
      ? getAccountContractExplorer(explorerView, account, parentAccount)
      : null;

  const submitNameChange = () => {
    if (!nameEl.current.innerText) {
      return;
    }
    updateAccount({
      ...account,
      name: nameEl.current.innerText,
    });
  };

  const submitNameChangeOnNewLine = evt => {
    const keyCode = evt.keyCode || evt.which;

    if (keyCode === 13) {
      evt.returnValue = false;
      if (evt.preventDefault) evt.preventDefault();
      evt.target.blur();
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
    if (nameEl.current && !editingName) {
      nameEl.current.innerText = getAccountName(account);
    }
  }, [editingName, account]);

  return (
    <Box horizontal shrink alignItems="center" flow={3}>
      <Box>
        <ParentCryptoCurrencyIcon currency={currency} bigger />
      </Box>
      <Box style={{ alignItems: "flex-start", flex: 1 }}>
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
        ) : (
          <CurName>{currency.name}</CurName>
        )}
        <AccountNameBox horizontal alignItems="center" flow={2}>
          <AccountName
            color="palette.text.shade100"
            contentEditable="true"
            suppressContentEditableWarning={true}
            ff="Inter|SemiBold"
            fontSize={7}
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
            onPaste={evt => {
              evt.preventDefault();
              const text = evt.clipboardData.getData("text/plain");
              document.execCommand("insertHTML", false, text);
            }}
            onKeyPress={submitNameChangeOnNewLine}
            innerRef={nameEl}
          />
          <IconPen size={14} />
          {editingName && (
            <IconButton>
              <Box justifyContent="center">
                <IconCross size={16} />
              </Box>
            </IconButton>
          )}
          {editingName && (
            <IconButton onMouseDown={submitNameChange}>
              <Box justifyContent="center" color="positiveGreen">
                <IconCheck size={16} />
              </Box>
            </IconButton>
          )}
        </AccountNameBox>
      </Box>
    </Box>
  );
});

export default connect(null, mapDispatchToProps)(AccountHeader);
