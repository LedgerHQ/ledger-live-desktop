// @flow

import React, { useState, useRef, useLayoutEffect } from "react";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
// @ts-ignore
import { getAssetsDistribution } from "@ledgerhq/live-common/lib/portfolio";
import styled from "styled-components";
// @ts-ignore
import Text from "../Text";
// @ts-ignore
import Box from "../Box";
// @ts-ignore
import Card from "../Box/Card";
// @ts-ignore
import IconAngleDown from "../../icons/AngleDown";
// @ts-ignore
import { calculateCountervalueSelector } from "../../actions/general";
// @ts-ignore
import { accountsSelector } from "../../reducers/accounts";
import Row from "./Row";
import Header from "./Header";

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

export default function AssetDistribution() {
  const {
    showFirst: initialRowCount,
    list,
    list: { length: totalRowCount },
  } = useSelector(distributionSelector);
  const cardRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);

  const [isVisible, setVisible] = useState(false);
  useLayoutEffect(() => {
    const scrollArea = document.getElementById("scroll-area");
    if (!cardRef.current) {
      return;
    }
    const callback: ConstructorParameters<typeof IntersectionObserver>[0] = entries => {
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

  const almostAll = initialRowCount + 3 > totalRowCount;
  const subList: any[] = showAll || almostAll ? list : list.slice(0, initialRowCount);

  return (
    <>
      <Box horizontal alignItems="center">
        <Text
          ff="Inter|Medium"
          fontSize={6}
          color="palette.text.shade100"
          data-e2e="title_assetDistribution"
        >
          <Trans i18nKey="distribution.header" values={{ count: totalRowCount }} />
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
}

interface SeeAllButtonProps {
  expanded: boolean;
}

const SeeAllButton = styled.div<SeeAllButtonProps>`
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
