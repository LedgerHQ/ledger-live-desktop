// @flow
import LedgerAcademyBanner from "~/renderer/components/Carousel/banners/LedgerAcademy";
import BackupPackBanner from "~/renderer/components/Carousel/banners/BackupPack";
import StakeCosmosBanner from "~/renderer/components/Carousel/banners/StakeCosmos";
import BuyCryptoBanner from "~/renderer/components/Carousel/banners/BuyCrypto";
import StakeAlgorandBanner from "~/renderer/components/Carousel/banners/StakeAlgorand";
import SwapBanner from "~/renderer/components/Carousel/banners/Swap";
import LendingBanner from "~/renderer/components/Carousel/banners/Lending";
import BlackFridayBanner from "~/renderer/components/Carousel/banners/BlackFriday";

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
  return [
    { id: "backupPackBanner", Component: BackupPackBanner },
    { id: "ledgerAcademy", Component: LedgerAcademyBanner },
    { id: "swap", Component: SwapBanner },
    { id: "stakeCosmos", Component: StakeCosmosBanner },
    { id: "buyCrypto", Component: BuyCryptoBanner },
    { id: "stakeAlgorand", Component: StakeAlgorandBanner },
    { id: "lending", Component: LendingBanner },
    {
      id: "blackfriday",
      Component: BlackFridayBanner,
      start: new Date("1 Nov 2020 00:01:00 PST"),
      end: new Date("30 Nov 2020 23:59:00 PST"),
    },
  ];
};
