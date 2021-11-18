import React, { useState, useCallback, useEffect, useRef } from "react";

import { Flex, Icons, Logos, Text } from "@ledgerhq/react-ui";
import styled from "styled-components";
import { TransitionGroup } from "react-transition-group";
import TransitionSlide from "@ledgerhq/react-ui/components/transitions/TransitionSlide";

const Wrapper = styled(Flex)`
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  justify-content: center;
  text-align: center;
  width: 350px;
  margin: auto;
  height: 100%;
`;

const SlideLogo = styled(Flex)<{ image?: string }>`
  min-height: 350px;
  min-width: 350px;
  margin-bottom: 40px;
  background: url(${(p) => p.image}) no-repeat;
  background-position: center center; 
  background-size: contain;
  z-index: ${(p) => p.theme.zIndexes[8]};
`;

export type SlideProps = {
  title: string;
  description: string;
  image?: string;
};

const Slide = ({ title, description, image }: SlideProps): React.ReactElement => {
  return (
    <Wrapper>
      <SlideLogo key={"key"} image={image} />
      <Text mb={12} ff="Alpha|Medium" textTransform="uppercase" variant="h3" fontWeight="400" fontSize={28}>
        {title}
      </Text>
      <Text mb={76} variant="body" ff="Alpha|Medium" fontWeight="500" fontSize={14}>
        {description}
      </Text>
    </Wrapper>
  );
};

const CarouselWrapper = styled.div`
  flex: 1;
  height: 700px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 44px;
  position: relative;
`;

const Controllers = styled(Flex)`
  position: absolute;
  flex-direction: row;
  right: ${(p) => p.theme.space[5]}px;
  bottom: ${(p) => p.theme.space[4]}px;
  column-gap: ${(p) => p.theme.space[4]}px;
  color: ${(p) => p.theme.colors.palette.neutral.c00};

  > div {
    &:hover {
      opacity: 0.5;
    }
  }
`;

const Bullets = styled.div<{ active?: number }>`
  position: absolute;
  display: flex;
  left: ${(p) => p.theme.space[8]}px;
  bottom: ${(p) => p.theme.space[8]}px;
  column-gap: ${(p) => p.theme.space[2]}px;
  flex-direction: row;

  > div {
    position: relative;
    height: ${(p) => p.theme.space[1]}px;
    width: ${(p) => p.theme.space[8]}px;
    background: ${(p) => p.theme.colors.palette.neutral.c00};
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
      top: -${(p) => p.theme.space[4]}px;
      height: ${(p) => p.theme.space[7]}px;
      width: 100%;
    }
  }
`;

export type Props = {
  timeout?: number;
  queue: SlideProps[];
};

const DEFAULT_TIMEOUT = 7000;
const Carousel = ({
  timeout = DEFAULT_TIMEOUT,
  queue,
}: Props): React.ReactElement | null => {
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const [direction, setDirection] = useState("right");
  const [index, setIndex] = useState(0);
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
    <CarouselWrapper onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <TransitionGroup component={null} childFactory={childFactory}>
        <TransitionSlide key={index} direction={direction}>
          <Slide {...queue[index]} />
        </TransitionSlide>
      </TransitionGroup>

      <Bullets active={index + 1}>
        {queue.map((_, i) => (
          <div key={`bullet_${i}`} onClick={() => wrappedSetIndex(i)} />
        ))}
      </Bullets>

      <Controllers>
        <div onClick={onPrevious}>
          <Icons.ArrowLeftMedium size={20} />
        </div>
        <div onClick={onNext}>
          <Icons.ArrowRightMedium size={20} />
        </div>
      </Controllers>
    </CarouselWrapper>
  );
};

export default Carousel;
