import React, { useRef, useCallback, useState, useEffect } from "react";
import styled from "styled-components";
import { TransitionGroup } from "react-transition-group";
import TransitionSlide from "@ui/components/Transition/TransitionSlide";

import Button from "@ui/components/Button";
import Text from "@ui/components/Text";
import Flex from "@ui/components/Layout/Flex";
import Slide from "@ui/components/Carousel/Slide";

import IconLeft from "@ui/assets/icons/ArrowLeftMedium";
import IconRight from "@ui/assets/icons/ArrowRightMedium";
import IconClose from "@ui/assets/icons/CloseMedium";

const CarouselWrapper = styled.div`
  width: 100%;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  flex: 1;
  background: ${(p) => p.theme.colors.palette.v2.text.default};
`;

const Controllers = styled(Flex)`
  position: absolute;
  right: 14px;
  bottom: 6px;
  flex-direction: row;
  column-gap: 8px;
  color: ${(p) => p.theme.colors.palette.v2.background.default};

  > div {
    &:hover {
      opacity: 0.5;
    }
  }
`;

const Bullets = styled.div<{ active?: number }>`
  position: absolute;
  display: flex;
  left: 24px;
  bottom: 22px;
  column-gap: 4px;
  flex-direction: row;

  > div {
    position: relative;
    height: 2px;
    width: 24px;
    background: ${(p) => p.theme.colors.palette.v2.background.default};
    opacity: 0.5;
    &:hover {
      opacity: 0.75;
    }

    &:nth-child(${(p) => p.active}) {
      opacity: 1;
      &:hover {
        opacity: 0.75;
      }
    }

    ::after {
      content: "";
      position: absolute;
      top: -10px;
      height: 20px;
      width: 100%;
    }
  }
`;

const Close = styled.div`
  position: absolute;
  top: 18px;
  right: 14px;
  color: ${(p) => p.theme.colors.palette.v2.background.default};
  &:hover {
    opacity: 0.5;
  }
`;

const DismissWrapper = styled.div`
  color: white;
  font-size: 100px;
  align-items: center;
  justify-content: center;
  display: flex;
`;

type Props = {
  timeout?: number;
  queue: [];
  onDismiss: () => void;
};

const DEFAULT_TIMEOUT = 7000;
const Carousel = ({
  timeout = DEFAULT_TIMEOUT,
  queue,
  onDismiss,
}: Props): React.ReactElement | null => {
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const [direction, setDirection] = useState("right");
  const [index, setIndex] = useState(0);
  const [wantToDismiss, setWantToDismiss] = useState(false);
  const [paused, setPaused] = useState(false);
  const childFactory = useCallback(
    (child) => React.cloneElement(child, { direction }),
    [direction],
  );

  const wrappedSetIndex = useCallback(
    (newIndex) => {
      setDirection(newIndex > index ? "left" : "right");
      setIndex(newIndex);
    },
    [index],
  );

  const onSlide = useCallback(
    (direction = "left") => {
      setDirection(direction);
      const i = index + (direction === "right" ? -1 : 1);
      setIndex(i < 0 ? queue.length - 1 : i >= queue.length ? 0 : i);
    },
    [index, queue],
  );
  const onPrevious = useCallback(() => onSlide("right"), [onSlide]);
  const onNext = useCallback(() => onSlide("left"), [onSlide]);

  const onWantToDismiss = () => setWantToDismiss(true);
  const onCancelDismiss = () => setWantToDismiss(false);

  const onMouseEnter = () => setPaused(true);
  const onMouseLeave = () => setPaused(false);

  useEffect(() => {
    // Nb we pause automatic transitions when the mouse is within the carousel.
    // Override passed timeout if lower than 1000ms
    const _timeout = timeout < 1000 ? DEFAULT_TIMEOUT : timeout;
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!paused) intervalRef.current = setInterval(onSlide, _timeout);
  }, [onSlide, paused, timeout]);

  if (!queue?.length) return null;

  return (
    <CarouselWrapper id={"carousel"} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {wantToDismiss ? (
        <DismissWrapper>
          <Text color="white">{"pending"}</Text>
        </DismissWrapper>
      ) : (
        <div>
          <TransitionGroup component={null} childFactory={childFactory}>
            <TransitionSlide key={index} direction={direction}>
              <Slide {...queue[index]} />
            </TransitionSlide>
          </TransitionGroup>

          <Close id={"carousel-dismiss"} onClick={onWantToDismiss}>
            <IconClose size={18} />
          </Close>

          <Bullets active={index + 1}>
            {queue.map((_, i) => (
              <div key={`bullet_${i}`} onClick={() => wrappedSetIndex(i)} />
            ))}
          </Bullets>

          <Controllers>
            <div onClick={onPrevious}>
              <IconLeft size={20} />
            </div>
            <div onClick={onNext}>
              <IconRight size={20} />
            </div>
          </Controllers>
        </div>
      )}
    </CarouselWrapper>
  );
};

export default Carousel;
