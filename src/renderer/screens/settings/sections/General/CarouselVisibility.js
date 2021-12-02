// @flow
import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { carouselVisibilitySelector } from "~/renderer/reducers/settings";
import { setCarouselVisibility } from "~/renderer/actions/settings";
import Track from "~/renderer/analytics/Track";
import Switch from "~/renderer/components/Switch";
import { CAROUSEL_NONCE } from "~/renderer/components/Carousel";

const CarouselVisibility = () => {
  const dispatch = useDispatch();
  const carouselVisibility = useSelector(carouselVisibilitySelector);
  const onSetCarouselVisibility = useCallback(
    checked => dispatch(setCarouselVisibility(checked ? 0 : CAROUSEL_NONCE)),
    [dispatch],
  );

  return (
    <>
      <Track onUpdate event="CarouselVisibility" />
      <Switch
        isChecked={carouselVisibility !== CAROUSEL_NONCE}
        onChange={onSetCarouselVisibility}
        data-test-id="settings-display-carousel"
      />
    </>
  );
};

export default CarouselVisibility;
