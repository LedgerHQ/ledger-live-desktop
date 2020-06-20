// @flow

import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useTransition, animated } from "react-spring";
import IconArrowRight from "~/renderer/icons/ArrowRight";
import { Card } from "~/renderer/components/Box";
import TimeBasedProgressBar from "~/renderer/components/Carousel/TimeBasedProgressBar";
import IconCross from "~/renderer/icons/Cross";
import { getTransitions, getDefaultSlides } from "~/renderer/components/Carousel/helpers";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { hasDismissedCarouselSelector } from "~/renderer/reducers/application";
import { setDismissedCarousel } from "~/renderer/actions/application";

const CarouselWrapper: ThemedComponent<{}> = styled(Card)`
  position: relative;
  height: 169px;
  margin: 20px 0;
`;

const Close = styled.div`
  position: absolute;
  color: rgba(255, 255, 255, 0.3);
  top: 16px;
  right: 16px;
  cursor: pointer;
  &:hover {
    color: #ffffff;
  }
`;

const Previous = styled.div`
  position: absolute;
  color: ${p => p.theme.colors.palette.text.shade100};
  bottom: 16px;
  right: 42px;
  cursor: pointer;
  transform: rotate(180deg);
`;

const Next = styled.div`
  position: absolute;
  color: ${p => p.theme.colors.palette.text.shade100};
  bottom: 11px;
  right: 16px;
  cursor: pointer;
`;

const ProgressBarWrapper = styled.div`
  position: absolute;
  bottom: 0;
  z-index: 100;
  width: 100%;
`;
const Bullets = styled.div`
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  & > div {
    cursor: pointer;
    border-radius: 6px;
    height: 6px;
    width: 6px;
    background: rgba(255, 255, 255, 0.3);
    margin: 0 5px;
    &:nth-child(${p => p.index + 1}) {
      background: #ffffff;
    }
  }
`;

const Slides = styled.div`
  width: 100%;
  height: 169px;
  border-radius: 4px;
  perspective: 1000px;
  overflow: hidden;
  background: #32415e;

  & > div {
    transform-origin: center right;
    backface-visibility: hidden;
    transform-style: preserve-3d;
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: 800;
    font-size: 8em;
    will-change: transform, opacity;
  }
`;

const Carousel = ({
  withArrows = false,
  controls = true,
  speed = 5000,
  type = "slide",
  slides: _slides,
}: {
  withArrows?: boolean,
  controls?: boolean,
  speed?: number,
  type?: "slide" | "flip",
  slides?: [{ id: string, Component: React$ComponentType<{}> }],
}) => {
  const slides = _slides || getDefaultSlides();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reverse, setReverse] = useState(false);
  const transitions = useTransition(index, p => p, getTransitions(type, reverse));

  const dispatch = useDispatch();
  const dismissedCarousel = useSelector(hasDismissedCarouselSelector);

  const onChooseSlide = useCallback(
    newIndex => {
      setReverse(index > newIndex);
      setIndex(newIndex);
    },
    [index],
  );

  const onNext = useCallback(() => {
    setReverse(false);
    setIndex((index + 1) % slides.length);
  }, [index, slides.length]);

  const onPrev = useCallback(() => {
    setReverse(true);
    setIndex(!index ? slides.length - 1 : index - 1);
  }, [index, slides.length]);

  const onDismiss = useCallback(() => {
    dispatch(setDismissedCarousel(true));
  }, [dispatch]);

  if (!slides.length || dismissedCarousel) {
    // No slides or dismissed, no problem
    return null;
  }

  const showControls = controls && slides.length > 1;

  return (
    <CarouselWrapper onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {slides.length > 1 ? (
        <ProgressBarWrapper>
          <TimeBasedProgressBar onComplete={onNext} duration={5000} paused={paused} />
        </ProgressBarWrapper>
      ) : null}
      <Slides>
        {transitions.map(({ item, props, key }) => {
          const { Component } = slides[item];
          return (
            <animated.div key={key} style={{ ...props }}>
              <Component />
            </animated.div>
          );
        })}
      </Slides>
      <Close onClick={onDismiss}>
        <IconCross size={16} />
      </Close>
      {showControls ? (
        <>
          {withArrows ? (
            <>
              <Next onClick={onNext}>
                <IconArrowRight size={16} />
              </Next>
              <Previous onClick={onPrev}>
                <IconArrowRight size={16} />
              </Previous>
            </>
          ) : (
            <Bullets index={index}>
              {slides.map((_, i) => (
                <div key={i} onClick={() => onChooseSlide(i)} />
              ))}
            </Bullets>
          )}
        </>
      ) : null}
    </CarouselWrapper>
  );
};

export default Carousel;
