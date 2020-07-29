// @flow
import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideCarouselSelector } from "~/renderer/reducers/settings";
import { setHideCarousel } from "~/renderer/actions/settings";
import Track from "~/renderer/analytics/Track";
import Switch from "~/renderer/components/Switch";

const HideCarousel = () => {
  const dispatch = useDispatch();
  const hidden = useSelector(hideCarouselSelector);
  const onHideCarousel = useCallback(hidden => dispatch(setHideCarousel(hidden)), [dispatch]);

  return (
    <>
      <Track onUpdate event="HideCarousel" />
      <Switch isChecked={hidden} onChange={onHideCarousel} id="settings-display-carousel" />
    </>
  );
};

export default HideCarousel;
