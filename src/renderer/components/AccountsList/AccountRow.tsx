import React from "react";
import styled, { CSSProperties } from "styled-components";
// import type { Account } from "@ledgerhq/live-common/lib/types";
// @ts-ignore
import { getEnv } from "@ledgerhq/live-common/lib/env";
// @ts-ignore
import { darken } from "../../styles/helpers";
// @ts-ignore
import Box, { Tabbable } from "../Box";
// @ts-ignore
import CheckBox from "../CheckBox";
// @ts-ignore
import CryptoCurrencyIconWithCount from "../CryptoCurrencyIconWithCount";
// @ts-ignore
import FormattedVal from "../FormattedVal";
// @ts-ignore
import Input from "../Input";

interface Props {
  // [TODO] account: Account;
  account: any;
  isChecked?: boolean;
  isDisabled?: boolean;
  isReadonly?: boolean;
  autoFocusInput?: boolean;
  accountName: string;
  // [TODO] onToggleAccount?: (account: Account, isChecked?: boolean) => void;
  onToggleAccount?: (account: any, isChecked?: boolean) => void;
  // [TODO] onEditName?: (account: Account, name: string) => void;
  onEditName?: (account: any, name: string) => void;
  hideAmount?: boolean;
}

export default function AccountRow({
  account,
  isChecked,
  onEditName,
  accountName,
  onToggleAccount: onToggleAccountProp,
  isDisabled,
  isReadonly,
  autoFocusInput,
  hideAmount,
}: Props) {
  // @ts-ignore
  const handlePreventSubmit: React.ComponentProps<Input>["onEnter"] = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  // @ts-ignore
  const handleKeyPress: React.ComponentProps<Input>["onKeyPress"] = e => {
    // this fixes a bug with the event propagating to the Tabbable
    e.stopPropagation();
  };

  const onToggleAccount: React.ComponentProps<typeof AccountRowContainer>["onClick"] = () => {
    if (onToggleAccountProp) onToggleAccountProp(account, !isChecked);
  };

  // @ts-ignore
  const handleChangeName: React.ComponentProps<Input>["onChange"] = name => {
    if (onEditName) onEditName(account, name);
  };

  // @ts-ignore
  const onClickInput: React.ComponentProps<Input>["onClick"] = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  // @ts-ignore
  const onFocus: React.ComponentProps<Input>["onFocus"] = e => {
    e.target.select();
  };

  // @ts-ignore
  const onBlur: React.ComponentProps<Input>["onBlur"] = e => {
    const { value } = e.target;
    if (!value && onEditName) {
      // don't leave an empty input on blur
      onEditName(account, account.name);
    }
  };

  const overflowStyles: CSSProperties = {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  };
  const tokenCount = (account.subAccounts && account.subAccounts.length) || 0;

  return (
    <AccountRowContainer isDisabled={isDisabled} onClick={isDisabled ? null : onToggleAccount}>
      <CryptoCurrencyIconWithCount currency={account.currency} count={tokenCount} withTooltip />
      <Box shrink grow ff="Inter|SemiBold" color="palette.text.shade100" fontSize={4}>
        {onEditName ? (
          <InputWrapper>
            <Input
              style={overflowStyles}
              value={accountName}
              onChange={handleChangeName}
              onClick={onClickInput}
              onEnter={handlePreventSubmit}
              onFocus={onFocus}
              onBlur={onBlur}
              onKeyPress={handleKeyPress}
              maxLength={getEnv("MAX_ACCOUNT_NAME_SIZE")}
              editInPlace
              autoFocus={autoFocusInput}
            />
          </InputWrapper>
        ) : (
          <div style={{ ...overflowStyles, paddingLeft: 15 }}>{accountName}</div>
        )}
      </Box>
      {!hideAmount ? (
        <FormattedVal
          val={account.balance}
          unit={account.unit}
          style={{ textAlign: "right", width: "auto" }}
          showCode
          fontSize={4}
          color="palette.text.shade60"
        />
      ) : null}
      {!isDisabled && !isReadonly && <CheckBox disabled isChecked={isChecked || !!isDisabled} />}
    </AccountRowContainer>
  );
}

interface AccountRowContainerProps {
  isDisabled?: boolean;
}

const AccountRowContainer = styled(Tabbable).attrs<AccountRowContainerProps>(() => ({
  horizontal: true,
  alignItems: "center",
  bg: "palette.background.default",
  px: 3,
  flow: 3,
}))`
  height: 48px;
  border-radius: 4px;

  opacity: ${p => (p.isDisabled ? 0.5 : 1)};
  pointer-events: ${p => (p.isDisabled ? "none" : "auto")};

  &:hover {
    background-color: ${p => darken(p.theme.colors.palette.background.default, 0.015)};
  }

  &:active {
    background-color: ${p => darken(p.theme.colors.palette.background.default, 0.03)};
  }
`;

const InputWrapper = styled.div`
  margin-left: 4px;

  & > div > div {
    padding-left: 10px;
    padding-right: 10px;
  }
`;
