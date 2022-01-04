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

type Props = {
  accounts: AccountLike[],
};

export default function AccountDistribution({ accounts }: Props) {
  const { t } = useTranslation();
  const total = accounts.reduce((total, a) => total.plus(a.balance), BigNumber(0));
  const accountDistribution = useMemo(
    () =>
      accounts
        .map(a => {
          const from = getAccountCurrency(a);
          return {
            account: a,
            currency: from,
            distribution: a.balance.div(total).toNumber(),
            amount: a.balance,
          };
        })
        .sort((a, b) => b.distribution - a.distribution),
    [accounts, total],
  );

  const cardRef = useRef(null);
  const [isVisible, setVisible] = useState(!!process.env.PLAYWRIGHT_RUN || false);

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
