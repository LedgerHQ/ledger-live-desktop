// @flow
import React from "react";
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
        source: require("./banners/LedgerAcademy/images/bg.png").default,
        transform: [-100, 100, 20, 80],
        size: {
          width: 400,
          height: 200,
        },
      },
      {
        source: require("./banners/LedgerAcademy/images/card.png").default,
        transform: [80, 25, 80, 25],
        size: {
          width: 139,
          height: 109,
        },
      },
      {
        source: require("./banners/LedgerAcademy/images/coin.png").default,
        transform: [50, 40, 140, 40],
        size: {
          width: 28,
          height: 62,
        },
      },
      {
        source: require("./banners/LedgerAcademy/images/coin2.png").default,
        transform: [0, 35, 120, 35],
        size: {
          width: 26,
          height: 32,
        },
      },
      {
        source: require("./banners/LedgerAcademy/images/hat.png").default,
        transform: [5, 8, 40, 8],
        size: {
          width: 150,
          height: 112,
        },
      },
      {
        source: require("./banners/LedgerAcademy/images/nano.png").default,
        transform: [140, 15, -25, 15],
        size: {
          width: 27,
          height: 150,
        },
      },
    ],
  },
  {
    url: "ledgerlive://buy",
    name: "buyCrypto",
    title: <Trans i18nKey={`banners.buyCrypto.title`} />,
    description: <Trans i18nKey={`banners.buyCrypto.description`} />,
    imgs: [
      {
        source: require("./banners/BuyCrypto/images/bg.png").default,
        transform: [-40, 100, 10, 80],
        size: {
          width: 293,
          height: 224,
        },
      },
      {
        source: require("./banners/BuyCrypto/images/cart.png").default,
        transform: [40, 50, 15, 50],
        size: {
          width: 129,
          height: 171,
        },
      },
      {
        source: require("./banners/BuyCrypto/images/coin.png").default,
        transform: [136, 25, 76, 25],
        size: {
          width: 31,
          height: 26,
        },
      },
      {
        source: require("./banners/BuyCrypto/images/coin2.png").default,
        transform: [150, 35, 42, 35],
        size: {
          width: 18,
          height: 20,
        },
      },
      {
        source: require("./banners/BuyCrypto/images/coin3.png").default,
        transform: [105, 15, 50, 15],
        size: {
          width: 37,
          height: 30,
        },
      },
    ],
  },
  {
    url: "ledgerlive://swap",
    name: "swap",
    title: <Trans i18nKey={`banners.swap.title`} />,
    description: <Trans i18nKey={`banners.swap.description`} />,
    imgs: [
      {
        source: require("./banners/Swap/images/bg.png").default,
        transform: [5, 100, 65, 80],
        size: {
          width: 210,
          height: 174,
        },
      },
      {
        source: require("./banners/Swap/images/coin1.png").default,
        transform: [18, 30, 80, 30],
        size: {
          width: 69,
          height: 78,
        },
      },
      {
        source: require("./banners/Swap/images/coin2.png").default,
        transform: [162, 30, 85, 30],
        size: {
          width: 72,
          height: 76,
        },
      },
      {
        source: require("./banners/Swap/images/loop.png").default,
        transform: [-10, 40, 45, 40],
        size: {
          width: 262,
          height: 139,
        },
      },
      {
        source: require("./banners/Swap/images/smallcoin1.png").default,
        transform: [157, 20, 100, 20],
        size: {
          width: 26,
          height: 21,
        },
      },
      {
        source: require("./banners/Swap/images/smallcoin2.png").default,
        transform: [110, 20, 140, 20],
        size: {
          width: 7,
          height: 8,
        },
      },
      {
        source: require("./banners/Swap/images/smallcoin3.png").default,
        transform: [90, 25, 85, 25],
        size: {
          width: 15,
          height: 20,
        },
      },
    ],
  },
  {
    url: urls.banners.backupPack,
    name: "backupPack",
    title: <Trans i18nKey={`banners.backupPack.title`} />,
    description: <Trans i18nKey={`banners.backupPack.description`} />,
    imgs: [
      {
        source: require("./banners/BackupPack/images/bg.png").default,
        transform: [0, 100, 0, 80],
        size: {
          width: 239,
          height: 276,
        },
      },
      {
        source: require("./banners/BackupPack/images/nanos.png").default,
        transform: [80, 60, 30, 20],
        size: {
          width: 144,
          height: 169,
        },
      },
      {
        source: require("./banners/BackupPack/images/nanox.png").default,
        transform: [-10, -60, 35, -20],
        size: {
          width: 141,
          height: 168,
        },
      },
    ],
  },
  {
    url: urls.banners.polkaStake,
    name: "polkaStake",
    title: <Trans i18nKey={`banners.polkaStake.title`} />,
    description: <Trans i18nKey={`banners.polkaStake.description`} />,
    imgs: [
      {
        source: require("./banners/PolkaStake/images/BG.png").default,
        transform: [0, 60, 5, 60],
        size: {
          width: 133,
          height: 111,
        },
      },
      {
        source: require("./banners/PolkaStake/images/hand.png").default,
        transform: [15, 25, -13, 25],
        size: {
          width: 111,
          height: 135,
        },
      },
    ],
  },
  {
    url: urls.banners.gateway,
    name: "polkaStake",
    title: <Trans i18nKey={`banners.gateway.title`} />,
    description: <Trans i18nKey={`banners.gateway.description`} />,
    imgs: [
      {
        source: require("./banners/Gateway/images/ledger.png").default,
        transform: [0, 30, 5, 30],
        size: {
          width: 162,
          height: 167,
        },
      },
      {
        source: require("./banners/Gateway/images/ball.png").default,
        transform: [0, 60, 20, 20],
        size: {
          width: 150,
          height: 150,
        },
      },
      {
        source: require("./banners/Gateway/images/satellite.png").default,
        transform: [-10, 15, 5, 15],
        size: {
          width: 151,
          height: 163,
        },
      },
    ],
  },
];

export const getDefaultSlides = () => {
  // $FlowFixMe
  return _.map(process.env.SPECTRON_RUN ? [SLIDES[2], SLIDES[1]] : SLIDES, (slide: Props) => ({
    id: slide.name,
    // eslint-disable-next-line react/display-name
    Component: () => <Slide {...slide} />,
    start: slide.start,
    end: slide.end,
  }));
};
