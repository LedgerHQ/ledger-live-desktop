// @flow

import React, { useState, useRef, useLayoutEffect } from "react";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import { getAssetsDistribution } from "@ledgerhq/live-common/lib/portfolio";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import Card from "~/renderer/components/Box/Card";
import IconAngleDown from "~/renderer/icons/AngleDown";
import { calculateCountervalueSelector } from "~/renderer/actions/general";
import { accountsSelector } from "~/renderer/reducers/accounts";
import Row from "./Row";
import Header from "./Header";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const SeeAllButton: ThemedComponent<{ expanded: boolean }> = styled.div`
  margin-top: 15px;
  display: flex;
  color: ${p => p.theme.colors.wallet};
  align-items: center;
  justify-content: center;
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  height: 40px;
  cursor: pointer;

  &:hover ${Text} {
    text-decoration: underline;
  }

  > :nth-child(2) {
    margin-left: 8px;
    transform: rotate(${p => (p.expanded ? "180deg" : "0deg")});
  }
`;

const distributionSelector = createSelector(
  accountsSelector,
  calculateCountervalueSelector,
  (acc, calc) =>
    getAssetsDistribution(acc, calc, {
      minShowFirst: 6,
      maxShowFirst: 6,
      showFirstThreshold: 0.95,
    }),
);

const AssetDistribution = () => {
  const distribution = useSelector(distributionSelector);
  const cardRef = useRef(null);
  const [showAll, setShowAll] = useState(false);

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

  const {
    showFirst: initialRowCount,
    list,
    list: { length: totalRowCount },
  } = distribution;

  const almostAll = initialRowCount + 3 > totalRowCount;
  const subList = showAll || almostAll ? list : list.slice(0, initialRowCount);

  return (
    <>
      <Box horizontal alignItems="center">
        <Text
          ff="Inter|Medium"
          fontSize={6}
          color="palette.text.shade100"
          data-e2e="title_assetDistribution"
        >
          <Trans i18nKey="distribution.header" values={{ count: distribution.list.length }} />
        </Text>
      </Box>
      <Card p={0} mt={24}>
        <Header />
        <div ref={cardRef}>
          {subList.map(item => (
            <Row key={item.currency.id} item={item} isVisible={isVisible} />
          ))}
        </div>
        {!almostAll && (
          <SeeAllButton expanded={showAll} onClick={() => setShowAll(state => !state)}>
            <Text color="wallet" ff="Inter|SemiBold" fontSize={4}>
              <Trans i18nKey={showAll ? "distribution.showLess" : "distribution.showAll"} />
            </Text>
            <IconAngleDown size={16} />
          </SeeAllButton>
        )}
      </Card>
    </>
  );
};

export default AssetDistribution;
