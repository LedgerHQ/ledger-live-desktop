// @flow

import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useTransition, animated } from "react-spring";
import IconArrowRight from "~/renderer/icons/ArrowRight";
import Box, { Card } from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import TimeBasedProgressBar from "~/renderer/components/Carousel/TimeBasedProgressBar";
import IconCross from "~/renderer/icons/Cross";
import { getTransitions, getDefaultSlides } from "~/renderer/components/Carousel/helpers";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { setCarouselVisibility } from "~/renderer/actions/settings";
import { carouselVisibilitySelector } from "~/renderer/reducers/settings";
import { Trans } from "react-i18next";

const CarouselWrapper: ThemedComponent<{}> = styled(Card)`
  position: relative;
  height: 100px;
  margin: 20px 0;
`;

const Close = styled.div`
  position: absolute;
  color: ${p => p.theme.colors.palette.text.shade30};
  top: 16px;
  right: 16px;
  cursor: pointer;
  &:hover {
    color: ${p => p.theme.colors.palette.text.shade100};
  }
`;

const Previous = styled.div`
  position: absolute;
  color: ${p => p.theme.colors.palette.text.shade30};
  bottom: 16px;
  right: 42px;
  cursor: pointer;
  transform: rotate(180deg);
  &:hover {
    color: ${p => p.theme.colors.palette.text.shade100};
  }
`;

const Next = styled.div`
  position: absolute;
  color: ${p => p.theme.colors.palette.text.shade30};
  bottom: 11px;
  right: 16px;
  cursor: pointer;
  &:hover {
    color: ${p => p.theme.colors.palette.text.shade100};
  }
`;

// NB left here because it handles the transitions
const ProgressBarWrapper = styled.div`
  position: absolute;
  bottom: 0;
  z-index: 100;
  width: 100%;
  display: none;
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
    & > span {
      display: block;
      border-radius: 6px;
      height: 6px;
      width: 6px;
      background: ${p => p.theme.colors.palette.text.shade40};
    }
    padding: 15px 5px;
    margin-bottom: -15px;
    &:nth-child(${p => p.index + 1}) > span {
      background: ${p => p.theme.colors.palette.text.shade80};
    }
  }
`;

const Disclaimer: ThemedComponent<{}> = styled(Card)`
  padding: 40px;
  height: 100px;
  margin: 20px 0;
  background: ${p => p.theme.colors.palette.background.paper};
  text-align: center;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`;

const Slides = styled.div`
  width: 100%;
  height: 100px;
  border-radius: 4px;
  perspective: 1000px;
  overflow: hidden;
  background: ${p => p.theme.colors.palette.background.paper};

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

export const Label: ThemedComponent<{}> = styled(Text)`
  color: ${p => p.theme.colors.palette.text.shade100};
  margin-bottom: 8px;
  max-width: 404px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

export const IllustrationWrapper: ThemedComponent<{}> = styled.div`
  width: 257px;
  height: 100%;
  pointer-events: none;
  position: relative;
  right: 0;
  align-self: flex-end;
  transform: scale(${p => p.scale || "0.7"}) translateY(${p => p.translateY || "-40"}px);
`;

export const Wrapper: ThemedComponent<{}> = styled.div`
  width: 100%;
  height: 100px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  cursor: pointer;
`;

export const CAROUSEL_NONCE: number = 5;

const Carousel = ({
  withArrows = true,
  controls = true,
  speed = 6000,
  type = "slide",
  slides: _slides,
}: {
  withArrows?: boolean,
  controls?: boolean,
  speed?: number,
  type?: "slide" | "flip",
  slides?: [{ id: string, Component: React$ComponentType<{}>, start?: Date, end?: Date }],
}) => {
  let slides = _slides || getDefaultSlides();
  slides = slides.filter(slide => {
    if (slide.start && slide.start > new Date()) {
      return false;
    }
    if (slide.end && slide.end < new Date()) {
      return false;
    }
    return true;
  });
  const [index, setIndex] = useState(0);
  const hidden = useSelector(carouselVisibilitySelector);
  const [paused, setPaused] = useState(false);
  const [wantToDismiss, setWantToDismiss] = useState(false);
  const [reverse, setReverse] = useState(false);
  const transitions = useTransition(index, p => p, getTransitions(type, reverse));

  const dispatch = useDispatch();
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
    setWantToDismiss(true);
  }, []);

  const onUndo = useCallback(() => {
    setWantToDismiss(false);
  }, []);

  const close = useCallback(() => dispatch(setCarouselVisibility(CAROUSEL_NONCE)), [dispatch]);

  if (!slides.length || hidden >= CAROUSEL_NONCE) {
    // No slides or dismissed, no problem
    return null;
  }

  const showControls = controls && slides.length > 1;

  return wantToDismiss ? (
    <Disclaimer>
      <Text ff="Inter|Regular" fontSize={4} color="palette.text.shade80">
        <Trans i18nKey="carousel.hidden.disclaimer" />
      </Text>
      <Box horizontal mt={3}>
        <Button mr={1} small primary onClick={close}>
          <Trans i18nKey="carousel.hidden.close" />
        </Button>
        <Button ml={1} small secondary outlineGrey onClick={onUndo}>
          <Trans i18nKey="carousel.hidden.undo" />
        </Button>
      </Box>
    </Disclaimer>
  ) : (
    <CarouselWrapper onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {slides.length > 1 ? (
        <ProgressBarWrapper>
          <TimeBasedProgressBar onComplete={onNext} duration={speed} paused={paused} />
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
                <div key={i} onClick={() => onChooseSlide(i)}>
                  <span />
                </div>
              ))}
            </Bullets>
          )}
        </>
      ) : null}
    </CarouselWrapper>
  );
};

export default Carousel;
