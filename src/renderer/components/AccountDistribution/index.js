// @flow

import React, { useLayoutEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Trans } from "react-i18next";
import { BigNumber } from "bignumber.js";
import Text from "~/renderer/components/Text";
import Card from "~/renderer/components/Box/Card";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import { counterValueCurrencySelector } from "~/renderer/reducers/settings";
import Box from "~/renderer/components/Box";
import Header from "./Header";
import Row from "./Row";
import type { AccountDistributionItem } from "./Row";
import { calculateCountervalueSelector } from "~/renderer/actions/general";

type Props = {
  accountDistribution: AccountDistributionItem[],
};

const mapStateToProps = (state, props) => {
  const { accounts } = props;
  const total = accounts.reduce((total, a) => total.plus(a.balance), BigNumber(0));

  return {
    accountDistribution: accounts
      .map(a => ({
        account: a,
        currency: getAccountCurrency(a),
        distribution: a.balance.div(total).toFixed(2),
        amount: a.balance,
        countervalue: calculateCountervalueSelector(state)(getAccountCurrency(a), a.balance),
      }))
      .sort((a, b) => b.distribution - a.distribution),
    counterValueCurrency: counterValueCurrencySelector,
  };
};

const AccountDistribution = ({ accountDistribution }: Props) => {
  const cardRef = useRef(null);
  const [isVisible, setVisible] = useState(false);
  useLayoutEffect(() => {
    const scrollArea = document.getElementById("scroll-area");
    if (!cardRef.current) {
      return;
    }
    const callback = entries => {
      if (entries[0] && entries[0].isIntersecting) {
        setVisible(true);
      }
    };
    const observer = new IntersectionObserver(callback, {
      threshold: 0.0,
      root: scrollArea,
      rootMargin: "-48px",
    });
    observer.observe(cardRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Box horizontal alignItems="center">
        <Text ff="Inter|Medium" fontSize={6} color="palette.text.shade100">
          <Trans
            i18nKey="accountDistribution.header"
            values={{ count: accountDistribution.length }}
            count={accountDistribution.length}
          />
        </Text>
      </Box>

      <Card p={0} mt={24}>
        <Header />
        <div ref={cardRef}>
          {accountDistribution.map(item => (
            <Row key={item.account.id} item={item} isVisible={isVisible} />
          ))}
        </div>
      </Card>
    </>
  );
};

const ConnectedAccountDistribution: React$ComponentType<{}> = connect(mapStateToProps)(
  AccountDistribution,
);
export default ConnectedAccountDistribution;
