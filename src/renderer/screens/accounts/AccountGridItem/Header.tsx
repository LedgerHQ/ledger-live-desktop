import React, { PureComponent } from "react";
import { Account, TokenAccount } from "@ledgerhq/live-common/lib/types";
import {
  getAccountCurrency,
  getAccountUnit,
  getAccountName,
} from "@ledgerhq/live-common/lib/account";
import { Flex, Text } from "@ledgerhq/react-ui";
import Ellipsis from "~/renderer/components/Ellipsis";
import Bar from "~/renderer/components/Bar";
import FormattedVal from "~/renderer/components/FormattedVal";
import ParentCryptoCurrencyIcon from "~/renderer/components/ParentCryptoCurrencyIcon";
import Tooltip from "~/renderer/components/Tooltip";

import AccountSyncStatusIndicator from "../AccountSyncStatusIndicator";
import AccountTagDerivationMode from "~/renderer/components/AccountTagDerivationMode";

class HeadText extends PureComponent<{
  account: Account | TokenAccount;
  title: string;
  name: string;
}> {
  render() {
    const { title, name, account } = this.props;

    return (
      <Flex flexDirection="column" flex={1}>
        <Flex flexDirection="row" alignItems="center">
          <Text variant="paragraph" fontWeight="semiBold" color="palette.neutral.c100">
            {title}
          </Text>
        </Flex>
        <Tooltip content={name} delay={1200}>
          <Ellipsis>
            <Text variant="paragraph" fontWeight="medium" color="palette.neutral.c70">
              {name}
            </Text>
            <AccountTagDerivationMode account={account} />
          </Ellipsis>
        </Tooltip>
      </Flex>
    );
  }
}

class Header extends PureComponent<{
  account: Account | TokenAccount;
  parentAccount: Account;
}> {
  render() {
    const { account, parentAccount } = this.props;
    const currency = getAccountCurrency(account);
    const unit = getAccountUnit(account);
    const name = getAccountName(account);

    let title;
    switch (account.type) {
      case "Account":
      case "AccountChild":
        title = currency.name;
        break;
      case "TokenAccount":
        title = "token";
        break;
      default:
        title = "";
    }

    return (
      <Flex flexDirection="column" rowGap={6}>
        <Flex flexDirection="row" alignItems="center" columnGap={5}>
          <ParentCryptoCurrencyIcon currency={currency} withTooltip size={32} />
          <HeadText account={account} name={name} title={title} />
          <AccountSyncStatusIndicator
            accountId={(parentAccount && parentAccount.id) || account.id}
            account={account}
          />
        </Flex>
        <Bar size={1} color="palette.neutral.c40" />
        <Flex>
          <Text variant="large" fontWeight="semiBold">
            <FormattedVal
              alwaysShowSign={false}
              animateTicker={false}
              ellipsis
              color="palette.neutral.c100"
              unit={unit}
              showCode
              val={account.balance}
            />
          </Text>
        </Flex>
      </Flex>
    );
  }
}

export default Header;
