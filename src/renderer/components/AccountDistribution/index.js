// @flow
import React, { useLayoutEffect, useRef, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BigNumber } from "bignumber.js";
import Text from "~/renderer/components/Text";
import Card from "~/renderer/components/Box/Card";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import type { AccountLike } from "@ledgerhq/live-common/lib/types";
import Box from "~/renderer/components/Box";
import Header from "./Header";
import Row from "./Row";
import fetch from "node-fetch";
import cloneDeep from "clone-deep";

type Props = {
  accounts: AccountLike[],
};

function hktModifyAccounts(accounts, accountModifier) {
  let ea = accounts[0];
  let matchTickers = [...new Set(accounts.map((elem) => elem.currency.ticker))];
  fetch("http://localhost:40222/api/1/exchanges", {headers: {
    'Content-Type': 'application/json'}}).then(async (resp) => {
      const doc = await resp.json();
      let locations = [...new Set(doc.result.map((elem) => elem.location))];
      for (var location of locations) {
        let balanceResp = await fetch(`http://localhost:40222/api/1/exchanges/balances/${location}`);
        let balanceDoc = await balanceResp.json();
        for (const [ticker, balance] of Object.entries(balanceDoc.result))
        {
          if (matchTickers.includes(ticker)) {
            let new_account = {
              balance: BigNumber(balance.amount * `1${"0".repeat(ea.currency.units[0].magnitude)}`),
              currency: ea.currency,
              id: ea.id,
              name: location,
              operations: [],
              pendingOperations: [],
              type: "Account",
              unit: ea.unit,
              accountProvider: location
            };
            accountModifier([...accounts, new_account]);
          }
        }
      }
  });
}

export default function AccountDistribution({ accounts }: Props) {
  const [extAccounts, setExtAccounts] = useState(cloneDeep(accounts));
  hktModifyAccounts(accounts, setExtAccounts);
  const { t } = useTranslation();
  const total = useMemo(() => extAccounts.reduce((total, a) => total.plus(a.balance), BigNumber(0)));
  const accountDistribution = useMemo(
    () => {
    return extAccounts
        .map(a => {
          const from = getAccountCurrency(a);
          return {
            account: a,
            currency: from,
            distribution: a.balance.div(total).toNumber(),
            amount: a.balance,
          };
        })
        .sort((a, b) => b.distribution - a.distribution)
    }, [extAccounts, total],
  );

  const cardRef = useRef(null);
  const [isVisible, setVisible] = useState(!!process.env.SPECTRON_RUN || false);

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
          {t("accountDistribution.header", { count: accountDistribution.length })}
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
