import React, { useCallback } from "react";
// @ts-ignore
import { getCurrencyColor } from "../../getCurrencyColor";
// @ts-ignore
import { getAccountName } from "@ledgerhq/live-common/lib/account";
// import type { Account, TokenAccount } from "@ledgerhq/live-common/lib/types/account";
// import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types/currencies";
import { BigNumber } from "bignumber.js";
import { useSelector } from "react-redux";
import styled, { useTheme } from "styled-components";
// @ts-ignore
import CounterValue from "../CounterValue";
// @ts-ignore
import FormattedVal from "../FormattedVal";
// @ts-ignore
import Text from "../Text";
// @ts-ignore
import Ellipsis from "../Ellipsis";
// @ts-ignore
import ParentCryptoCurrencyIcon from "../ParentCryptoCurrencyIcon";
// @ts-ignore
import Box from "../Box";
// @ts-ignore
import AccountContextMenu from "../ContextMenu/AccountContextMenu";
// @ts-ignore
import { accountsSelector } from "../../reducers/accounts";
// @ts-ignore
import IconDots from "../../icons/Dots";
// @ts-ignore
import Bar from "../AssetDistribution/Bar";
// @ts-ignore
import ToolTip from "../Tooltip";

import { useHistory } from "react-router-dom";

export interface AccountDistributionItem {
  // [TODO] account: Account | TokenAccount;
  account: any;
  distribution: number; // % of the total (normalized in 0-1)
  amount: BigNumber;
  // [TODO] currency: CryptoCurrency | TokenCurrency;
  currency: any;
  countervalue: BigNumber; // countervalue of the amount that was calculated based of the rate provided
}

interface Props {
  item: AccountDistributionItem;
  isVisible: boolean;
}

export default function Row({
  item: { currency, amount, distribution, account },
  isVisible,
}: Props) {
  // [TODO]
  const accounts: any[] = useSelector(accountsSelector);
  const theme = useTheme();
  const history = useHistory();
  const onAccountClick = useCallback(
    account => {
      history.push(
        account.type !== "Account"
          ? `/account/${account.parentId}/${account.id}`
          : `/account/${account.id}`,
      );
    },
    [history],
  );

  const parentAccount =
    account.type !== "Account" ? accounts.find(a => a.id === account.parentId) : null;
  // @ts-ignore
  const color = getCurrencyColor(currency, theme.colors.palette.background.paper);
  const displayName = getAccountName(account);
  const percentage = (Math.floor(distribution * 10000) / 100).toFixed(2);
  const icon = <ParentCryptoCurrencyIcon currency={currency} size={16} />;

  return (
    <AccountContextMenu account={account} parentAccount={parentAccount} withStar>
      <Wrapper onClick={() => onAccountClick(account)}>
        <AccountWrapper>
          {icon}
          <Box>
            {parentAccount ? (
              <Ellipsis fontSize={10} color="palette.text.shade80">
                <Text ff="Inter|SemiBold">{parentAccount.name}</Text>
              </Ellipsis>
            ) : null}
            <ToolTip content={displayName} delay={1200}>
              <Ellipsis ff="Inter|SemiBold" color="palette.text.shade100" fontSize={3}>
                {displayName}
              </Ellipsis>
            </ToolTip>
          </Box>
        </AccountWrapper>
        <Distribution>
          {!!distribution && (
            <>
              <Text ff="Inter" color="palette.text.shade100" fontSize={3}>
                {`${percentage}%`}
              </Text>
              <Bar progress={isVisible ? percentage : "0"} progressColor={color} />
            </>
          )}
        </Distribution>
        <Amount>
          <Ellipsis>
            <FormattedVal
              color={"palette.text.shade80"}
              unit={currency.units[0]}
              val={amount}
              fontSize={3}
              showCode
            />
          </Ellipsis>
        </Amount>
        <Value>
          <Ellipsis>
            {distribution ? (
              <CounterValue
                currency={currency}
                value={amount}
                disableRounding
                color="palette.text.shade100"
                fontSize={3}
                showCode
                alwaysShowSign={false}
              />
            ) : (
              <Text ff="Inter" color="palette.text.shade100" fontSize={3}>
                {"-"}
              </Text>
            )}
          </Ellipsis>
        </Value>
        <Dots>
          <AccountContextMenu leftClick account={account} parentAccount={parentAccount} withStar>
            <IconDots size={16} />
          </AccountContextMenu>
        </Dots>
      </Wrapper>
    </AccountContextMenu>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 20px;
  cursor: pointer;

  > * {
    display: flex;
    align-items: center;
    flex-direction: row;
    box-sizing: border-box;
  }

  &:hover {
    background: ${p => p.theme.colors.palette.background.default};
  }
`;

const AccountWrapper = styled.div`
  width: 25%;
  > :first-child {
    margin-right: 10px;
  }
  > :nth-child(2) {
    flex: 1;
    align-items: flex-start;
    margin-right: 8px;
  }
`;

const Distribution = styled.div`
  width: 25%;
  text-align: right;
  > :first-child {
    margin-right: 11px;
    width: 40px; //max width for a 99.99% case
    text-align: right;
  }
`;

const Amount = styled.div`
  width: 25%;
  text-align: right;
  justify-content: flex-end;
`;

const Value = styled.div`
  width: 20%;
  box-sizing: border-box;
  padding-left: 8px;
  text-align: right;
  justify-content: flex-end;
`;

const Dots = styled.div`
  width: 5%;
  justify-content: flex-end;
  cursor: pointer;
  color: ${p => p.theme.colors.palette.divider};
  &:hover {
    color: ${p => p.theme.colors.palette.text.shade60};
  }
`;
