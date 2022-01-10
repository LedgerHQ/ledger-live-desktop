// @flow
import React, { useMemo } from "react";
import _ from "lodash";
import { Trans } from "react-i18next";
import Slide from "./Slide";
import { urls } from "~/config/urls";

export const getTransitions = (transition: "slide" | "flip", reverse: boolean = false) => {
  const mult = reverse ? -1 : 1;
  return {
    flip: {
      from: {
        opacity: 1,
        transform: `rotateX(${180 * mult}deg)`,
      },
      enter: {
        opacity: 1,
        transform: "rotateX(0deg)",
      },
      leave: {
        opacity: 1,
        transform: `rotateX(${-180 * mult}deg)`,
      },
      config: { mass: 20, tension: 200, friction: 100 },
    },
    slide: {
      from: {
        position: "absolute",
        opacity: 1,
        transform: `translate3d(${100 * mult}%,0,0)`,
      },
      enter: {
        opacity: 1,
        transform: "translate3d(0%,0,0)",
      },
      leave: {
        opacity: 1,
        transform: `translate3d((${-100 * mult}%,0,0)`,
      },
      initial: null,
    },
  }[transition];
};

const SLIDES = [
  {
    url: urls.banners.ledgerAcademy,
    name: "ledgerAcademy",
    title: <Trans i18nKey={`banners.ledgerAcademy.title`} />,
    description: <Trans i18nKey={`banners.ledgerAcademy.description`} />,
    imgs: [
      {
        // $FlowFixMe
        source: require("./banners/LedgerAcademy/images/bg.png").default,
        transform: [0, 60, 5, 60],
        size: {
          width: 160,
          height: 160,
        },
      },
      {
        // $FlowFixMe
        source: require("./banners/LedgerAcademy/images/card.png").default,
        transform: [65, 50, 20, 50],
        size: {
          width: 109,
          height: 109,
        },
      },
      {
        // $FlowFixMe
        source: require("./banners/LedgerAcademy/images/coin.png").default,
        transform: [-15, 20, 25, 20],
        size: {
          width: 28,
          height: 67,
        },
      },
      {
        // $FlowFixMe
        source: require("./banners/LedgerAcademy/images/hat.png").default,
        transform: [10, 30, 0, 30],
        size: {
          width: 110,
          height: 112,
        },
      },
      {
        // $FlowFixMe
        source: require("./banners/LedgerAcademy/images/nano.png").default,
        transform: [75, 25, 8, 25],
        size: {
          width: 50,
          height: 27,
        },
      },
    ],
  },
  {
    path: "/exchange",
    name: "buyCrypto",
    title: <Trans i18nKey={`banners.buyCrypto.title`} />,
    description: <Trans i18nKey={`banners.buyCrypto.description`} />,
    imgs: [
      {
        // $FlowFixMe
        source: require("./banners/BuyCrypto/images/bg.png").default,
        transform: [-10, 60, -8, 60],
        size: {
          width: 180,
          height: 180,
        },
      },
      {
        // $FlowFixMe
        source: require("./banners/BuyCrypto/images/cart.png").default,
        transform: [20, 40, 7, 40],
        size: {
          width: 131,
          height: 130,
        },
      },
      {
        // $FlowFixMe
        source: require("./banners/BuyCrypto/images/coin.png").default,
        transform: [53, 30, 53, 30],
        size: {
          width: 151,
          height: 21,
        },
      },
      {
        // $FlowFixMe
        source: require("./banners/BuyCrypto/images/coin2.png").default,
        transform: [58, 25, 20, 25],
        size: {
          width: 151,
          height: 17,
        },
      },
      {
        // $FlowFixMe
        source: require("./banners/BuyCrypto/images/coin3.png").default,
        transform: [29, 20, 33, 20],
        size: {
          width: 151,
          height: 24,
        },
      },
    ],
  },
  {
    path: "/swap",
    name: "swap",
    title: <Trans i18nKey={`banners.swap.title`} />,
    description: <Trans i18nKey={`banners.swap.description`} />,
    imgs: [
      {
        // $FlowFixMe
        source: require("./banners/Swap/images/bg.png").default,
        transform: [0, 60, 5, 60],
        size: {
          width: 180,
          height: 180,
        },
      },
      {
        // $FlowFixMe
        source: require("./banners/Swap/images/coin1.png").default,
        transform: [37, 25, 24, 25],
        size: {
          width: 48,
          height: 55,
        },
      },
      {
        // $FlowFixMe
        source: require("./banners/Swap/images/coin2.png").default,
        transform: [115, 25, 28, 25],
        size: {
          width: 50,
          height: 53,
        },
      },
      {
        // $FlowFixMe
        source: require("./banners/Swap/images/loop.png").default,
        transform: [20, 35, 5, 35],
        size: {
          width: 160,
          height: 99,
        },
      },
      {
        // $FlowFixMe
        source: require("./banners/Swap/images/smallcoin1.png").default,
        transform: [115, 15, 35, 15],
        size: {
          width: 18,
          height: 14,
        },
      },
      {
        // $FlowFixMe
        source: require("./banners/Swap/images/smallcoin2.png").default,
        transform: [88, 20, 65, 20],
        size: {
          width: 4,
          height: 5,
        },
      },
      {
        // $FlowFixMe
        source: require("./banners/Swap/images/smallcoin3.png").default,
        transform: [78, 17, 32, 17],
        size: {
          width: 10,
          height: 13,
        },
      },
    ],
  },
  {
    url: urls.banners.familyPack,
    name: "familyPack",
    title: <Trans i18nKey={`banners.familyPack.title`} />,
    description: <Trans i18nKey={`banners.familyPack.description`} />,
    imgs: [
      {
        // $FlowFixMe
        source: require("./banners/BackupPack/images/bg.png").default,
        transform: [20, 60, 5, 60],
        size: {
          width: 150,
          height: 150,
        },
      },
      {
        // $FlowFixMe
        source: require("./banners/BackupPack/images/nanos.png").default,
        transform: [-55, 13, 5, 15],
        size: {
          width: 162,
          height: 167,
        },
      },
      {
        // $FlowFixMe
        source: require("./banners/BackupPack/images/nanos.png").default,
        transform: [0, 15, 5, 15],
        size: {
          width: 162,
          height: 167,
        },
      },
      {
        // $FlowFixMe
        source: require("./banners/BackupPack/images/nanos.png").default,
        transform: [55, 17, 5, 15],
        size: {
          width: 162,
          height: 167,
        },
      },
    ],
  },
];

export const useDefaultSlides = () => {
  return useMemo(
    () =>
      // $FlowFixMe
      _.map(process.env.PLAYWRIGHT_RUN ? [SLIDES[2], SLIDES[1]] : SLIDES, (slide: Props) => ({
        id: slide.name,
        // eslint-disable-next-line react/display-name
        Component: () => <Slide {...slide} />,
        start: slide.start,
        end: slide.end,
      })),
    [],
  );
};
