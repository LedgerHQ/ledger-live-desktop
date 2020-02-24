import React, { useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import { BigNumber } from "bignumber.js";
// @ts-ignore
import Text from "../Text";
// @ts-ignore
import Card from "../Box/Card";
// @ts-ignore
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
// @ts-ignore
import { counterValueCurrencySelector } from "../../reducers/settings";
// @ts-ignore
import Box from "../Box";
import Header from "./Header";
import Row from "./Row";
// @ts-ignore
import { calculateCountervalueSelector } from "../../actions/general";

interface Props {
  // [TODO] accounts: Account[];
  accounts: any[];
}

export default function AccountDistribution({ accounts }: Props) {
  const accountDistribution = useSelector(state => {
    const total = accounts.reduce((total, a) => total.plus(a.balance), new BigNumber(0));
    return accounts
      .map(a => ({
        account: a,
        currency: getAccountCurrency(a),
        distribution: a.balance.div(total).toFixed(2),
        amount: a.balance,
        countervalue: calculateCountervalueSelector(state)(getAccountCurrency(a), a.balance),
      }))
      .sort((a, b) => b.distribution - a.distribution);
  });

  const counterValueCurrency = useSelector(counterValueCurrencySelector);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setVisible] = useState(false);
  useLayoutEffect(() => {
    const scrollArea = document.getElementById("scroll-area");
    if (!cardRef.current) {
      return;
    }
    const callback: IntersectionObserverCallback = entries => {
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
}
