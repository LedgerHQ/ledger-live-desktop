import React, { PureComponent } from "react";
import styled, { css } from "styled-components";
import { Account } from "@ledgerhq/live-common/lib/types";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { Flex, Text } from "@ledgerhq/react-ui";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { Tabbable } from "~/renderer/components/Box";
import CheckBox from "~/renderer/components/CheckBox";
import CryptoCurrencyIconWithCount from "~/renderer/components/CryptoCurrencyIconWithCount";
import FormattedVal from "~/renderer/components/FormattedVal";
import Input from "~/renderer/components/Input";
import AccountTagDerivationMode from "../AccountTagDerivationMode";

const InputWrapper = styled.div`
  margin-left: 4px;
  width: 100%;
`;

const colorCSS = css<{ isChecked?: boolean; isDisabled?: boolean; uncheckedColor?: string }>`
  color: ${p => {
    const {
      theme: {
        colors: { palette },
      },
    } = p;
    return p.isChecked
      ? palette.primary.c90
      : p.isDisabled
      ? palette.neutral.c70
      : p.uncheckedColor || palette.neutral.c100;
  }};
`;

const AccountNameText = styled(Text).attrs(() => ({
  variant: "paragraph",
  fontWeight: "semiBold",
}))`
  ${colorCSS}
`;

const ValueText = styled(Text).attrs(() => ({
  variant: "paragraph",
  fontWeight: "medium",
  uncheckedColor: "palette.neutral.c80",
}))`
  ${colorCSS}
`;

const AccountRowContainer: ThemedComponent<{
  isDisabled?: boolean;
  isChecked?: boolean;
}> = styled(Tabbable).attrs(() => ({
  horizontal: true,
  alignItems: "center",
  padding: "16px",
}))`
  height: 48px;
  border-radius: 4px;
  opacity: ${p => (p.isDisabled ? 0.5 : 1)};
  pointer-events: ${p => (p.isDisabled ? "none" : "auto")};
  border: 1px solid ${p => (p.isChecked ? p.theme.colors.palette.primary.c40 : "transparent")};
  ${p =>
    p.isChecked
      ? `
    background-color: ${p.theme.colors.palette.primary.c20};
  `
      : ""}
`;

type Props = {
  account: Account;
  isChecked?: boolean;
  isDisabled?: boolean;
  isReadonly?: boolean;
  autoFocusInput?: boolean;
  accountName: string;
  onToggleAccount?: (arg0: Account, arg1: boolean) => void;
  onEditName?: (arg0: Account, arg1: string) => void;
  hideAmount?: boolean;
};

export default class AccountRow extends PureComponent<Props> {
  handlePreventSubmit = (e: SyntheticEvent<any>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  handleKeyPress = (e: SyntheticEvent<HTMLInputElement>) => {
    // this fixes a bug with the event propagating to the Tabbable
    e.stopPropagation();
  };

  onToggleAccount = () => {
    const { onToggleAccount, account, isChecked } = this.props;
    if (onToggleAccount) onToggleAccount(account, !isChecked);
  };

  handleChangeName = (name: string) => {
    const { onEditName, account } = this.props;
    if (onEditName) onEditName(account, name);
  };

  onClickInput = (e: SyntheticEvent<any>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  onFocus = (e: any) => {
    e.target.select();
  };

  onBlur = (e: any) => {
    const { onEditName, account } = this.props;
    const { value } = e.target;
    if (!value && onEditName) {
      // don't leave an empty input on blur
      onEditName(account, account.name);
    }
  };

  _input = null;
  overflowStyles = { textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" };
  render() {
    const {
      account,
      isChecked,
      onEditName,
      accountName,
      isDisabled,
      isReadonly,
      autoFocusInput,
      hideAmount,
    } = this.props;

    const tokenCount = (account.subAccounts && account.subAccounts.length) || 0;

    const tag = (
      <AccountTagDerivationMode
        tagType={isChecked ? "outlined" : undefined}
        disabled={!isChecked}
        account={account}
      />
    );

    return (
      <AccountRowContainer
        className="account-row"
        isDisabled={isDisabled}
        isChecked={isChecked}
        onClick={isDisabled ? null : this.onToggleAccount}
      >
        <CryptoCurrencyIconWithCount
          size="16px"
          currency={account.currency}
          count={tokenCount}
          withTooltip
        />
        <Flex flex={1} flexDirection="row" alignItems="center">
          {onEditName ? (
            <InputWrapper>
              <Input
                style={this.overflowStyles}
                value={accountName}
                onChange={this.handleChangeName}
                onClick={this.onClickInput}
                onEnter={this.handlePreventSubmit}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onKeyPress={this.handleKeyPress}
                maxLength={getEnv("MAX_ACCOUNT_NAME_SIZE")}
                editInPlace
                autoFocus={autoFocusInput}
                renderRight={tag}
              />
            </InputWrapper>
          ) : (
            <div style={{ ...this.overflowStyles, paddingLeft: 15, marginLeft: 4, width: "100%" }}>
              <AccountNameText isChecked={isChecked} isDisabled={isDisabled}>
                {accountName}
              </AccountNameText>
              {tag}
            </div>
          )}
        </Flex>
        {!hideAmount ? (
          <ValueText isChecked={isChecked} isDisabled={isDisabled}>
            <FormattedVal
              val={account.balance}
              unit={account.unit}
              style={{ textAlign: "right", width: "auto", minWidth: 120 }}
              color={
                isDisabled
                  ? "palette.neutral.c70"
                  : isChecked
                  ? "palette.primary.c90"
                  : "palette.neutral.c80"
              }
              showCode
            />
          </ValueText>
        ) : null}
        {!isDisabled && !isReadonly && (
          <>
            <div style={{ width: "16px" }} />
            <CheckBox variant="default" isChecked={isChecked || !!isDisabled} />
          </>
        )}
      </AccountRowContainer>
    );
  }
}
