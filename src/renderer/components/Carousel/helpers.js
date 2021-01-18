// @flow
import LedgerAcademyBanner from "~/renderer/components/Carousel/banners/LedgerAcademy";
import BackupPackBanner from "~/renderer/components/Carousel/banners/BackupPack";
import BuyCryptoBanner from "~/renderer/components/Carousel/banners/BuyCrypto";
import SwapBanner from "~/renderer/components/Carousel/banners/Swap";
// import SellBanner from "~/renderer/components/Carousel/banners/Sell";
// import LendingBanner from "~/renderer/components/Carousel/banners/Lending";
import ValentineBanner from "~/renderer/components/Carousel/banners/Valentine";
// import BlackFridayBanner from "~/renderer/components/Carousel/banners/BlackFriday";

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

export const getDefaultSlides = () => {
  if (process.env.SPECTRON_RUN) {
    return [{ id: "swap", Component: SwapBanner }];
  }

  return [
    {
      id: "valentine",
      Component: ValentineBanner,
      start: new Date("2 Feb 2021 00:01:00 PST"),
      end: new Date("15 Feb 2021 23:59:00 PST"),
    },
    { id: "ledgerAcademy", Component: LedgerAcademyBanner },
    { id: "buy", Component: BuyCryptoBanner },
    { id: "swap", Component: SwapBanner },
    // { id: "sell", Component: SellBanner },
    { id: "backupPackBanner", Component: BackupPackBanner },
    // { id: "lending", Component: LendingBanner },
  ];
};
