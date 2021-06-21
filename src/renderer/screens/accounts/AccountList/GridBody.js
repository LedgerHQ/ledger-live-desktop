// @flow
import React, { useMemo } from "react";
import { useTransition, animated } from "react-spring";
import styled from "styled-components";
import type { Account, TokenAccount } from "@ledgerhq/live-common/lib/types";
import type { PortfolioRange } from "@ledgerhq/live-common/lib/portfolio/v2/types";
import AccountCard from "../AccountGridItem";
import AccountCardPlaceholder from "../AccountGridItem/Placeholder";
import useMeasure from "./useMeasure";
import useMedia from "./useMedia";
import { useSelector } from "react-redux";
import { useDebounce } from "@ledgerhq/live-common/lib//hooks/useDebounce";

import { getCurrentDevice } from "~/renderer/reducers/devices";
import { amnesiaCookiesSelector } from "~/renderer/reducers/settings";

type Props = {
  visibleAccounts: (Account | TokenAccount)[],
  hiddenAccounts: (Account | TokenAccount)[],
  onAccountClick: (Account | TokenAccount) => void,
  lookupParentAccount: (id: string) => ?Account,
  range: PortfolioRange,
  showNewAccount: boolean,
};

export default function GridBody({
  visibleAccounts,
  hiddenAccounts,
  range,
  showNewAccount,
  onAccountClick,
  lookupParentAccount,
  ...rest
}: Props) {
  const columns = useMedia(
    ["(min-width: 1800px)", "(min-width: 1500px)", "(min-width: 1200px)", "(min-width: 900px)"],
    [5, 4, 3, 2],
    2,
  );
  const [bind, { width }] = useMeasure();
  const amnesiaCookies = useSelector(amnesiaCookiesSelector);
  const rawDevice = useSelector(getCurrentDevice);
  const device = useDebounce(rawDevice, 3000);
  const items = useMemo(
    () =>
      [...visibleAccounts, ...hiddenAccounts]
        .filter(Boolean)
        .sort((a, b) => {
          if (a.cookie === b.cookie) return 0;
          if (a.cookie === device?.cookie) return -1;
          if (b.cookie === device?.cookie) return 1;
          return 0;
        })
        .map(account => {
          return {
            account,
            cookie: device?.cookie && account.cookie === device.cookie,
            height: 250,
            amnesia: amnesiaCookies.includes(account?.cookie),
            css: account.id,
          };
        }),
    [visibleAccounts, hiddenAccounts, device, amnesiaCookies],
  );

  const [heights, gridItems] = useMemo(() => {
    const heights = new Array(columns).fill(0); // Each column gets a height starting with zero
    const gridItems = items.map((child, i) => {
      const column = heights.indexOf(Math.min(...heights)); // Basic masonry-grid placing, puts tile into the smallest column using Math.min
      const xy = [(width / columns) * column, (heights[column] += child.height) - child.height]; // X = container width / number of columns * column index, Y = it's just the height of the current column
      return { ...child, xy, width: 300, height: child.height };
    });
    return [heights, gridItems];
  }, [columns, items, width]);

  const transitions = useTransition(gridItems, i => i.css, {
    from: ({ xy, height, width }) => ({ xy, height, width, opacity: 0 }),
    enter: ({ xy, height, width }) => ({ xy, height, width, opacity: 1 }),
    update: ({ xy }) => ({ xy }),
    leave: { opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25,
  });

  return (
    <List {...bind} style={{ height: Math.max(...heights) }}>
      {transitions.map(({ item, props: { xy, ...rest }, key }) => (
        <animated.div
          key={key}
          style={{ transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`), ...rest }}
        >
          {item.account ? (
            <AccountCard
              cookie={item.cookie}
              amnesia={item.amnesia}
              key={item.account.id}
              account={item.account}
              parentAccount={
                item.account.type !== "Account" ? lookupParentAccount(item.account.parentId) : null
              }
              range={range}
              onClick={onAccountClick}
            />
          ) : (
            <AccountCardPlaceholder key="placeholder" />
          )}
        </animated.div>
      ))}
    </List>
  );
}

const List = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  & > div {
    position: absolute;
    will-change: transform, width, height, opacity;
  }

  & > div > div {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
`;
