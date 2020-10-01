// @flow
import LedgerAcademyBanner from "~/renderer/components/Carousel/banners/LedgerAcademy";
import BackupPackBanner from "~/renderer/components/Carousel/banners/BackupPack";
import StakeCosmosBanner from "~/renderer/components/Carousel/banners/StakeCosmos";
import BuyCryptoBanner from "~/renderer/components/Carousel/banners/BuyCrypto";
import StakeAlgorandBanner from "~/renderer/components/Carousel/banners/StakeAlgorand";
import SwapBanner from "~/renderer/components/Carousel/banners/Swap";

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
    { id: "swap", Component: SwapBanner },
    { id: "backupPackBanner", Component: BackupPackBanner },
    { id: "ledgerAcademy", Component: LedgerAcademyBanner },
    { id: "stakeCosmos", Component: StakeCosmosBanner },
    { id: "buyCrypto", Component: BuyCryptoBanner },
    { id: "stakeAlgorand", Component: StakeAlgorandBanner },
  ];
};
