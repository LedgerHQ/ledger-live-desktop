import React, { useState, useCallback, useEffect, useRef } from "react";

import { Button, Flex, Logos, Text } from "@ledgerhq/react-ui";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { TransitionGroup } from "react-transition-group";
import TransitionSlide from "@ledgerhq/react-ui/components/transitions/TransitionSlide";

import IconLeft from "@ledgerhq/react-ui/assets/icons/ArrowLeftMedium";
import IconRight from "@ledgerhq/react-ui/assets/icons/ArrowRightMedium";
import IconClose from "@ledgerhq/react-ui/assets/icons/CloseMedium";

export interface CarrousselStep {
    logo: string,
    titleKey: string,
    descKey: string,
}

interface CarrousselProps {
    onChange: (newIndex: number) => void,
    currentIndex: number,
    steps: CarrousselStep[]
} 

// export default function Carroussel(props: CarrousselProps){
//     const {steps, currentIndex, onChange} = props;
//     const {t} = useTranslation();
//     const currentStep = steps[currentIndex];

//     return <Flex flexDirection="column">
//         <Text type="h3">{t(currentStep.titleKey)}</Text>
//         <Text type="body">{t(currentStep.descKey)}</Text>
//     </Flex>
// }

const Wrapper = styled(Flex)<{ image?: string }>`
  width: 100%;
  height: 100%;
  background: gray;
  flex-direction: column;
  padding: ${(p) => p.theme.space[8]}px ${(p) => p.theme.space[10]}px;
  padding-top: 140px; // Nb gives air to not overlap the illustration
  z-index: ${(p) => p.theme.zIndexes[8]};
  background: url(${(p) => p.image}) no-repeat ${(p) => p.theme.colors.palette.neutral.c100};
  background-size: contain;
  background-position: right 60px bottom;
`;

export type SlideProps = {
  onClick: () => void;
  title: string;
  description: string;
  image?: string;
};

const Slide = ({ title, description, image, onClick }: SlideProps): React.ReactElement => {
  return (
    <Wrapper key={"key"} image={image} onClick={onClick}>
      <Text color="palette.neutral.c00" ff="Inter|Regular" fontSize={10}>
        {title}
      </Text>
      <Text color="palette.neutral.c00" ff="Alpha|Medium" textTransform="uppercase" fontSize={20}>
        {description}
      </Text>
    </Wrapper>
  );
};

const CarouselWrapper = styled.div`
  width: 100%;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  flex: 1;
  background: ${(p) => p.theme.colors.palette.neutral.c100};
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

const Close = styled.div`
  position: absolute;
  top: ${(p) => p.theme.space[7]}px;
  right: ${(p) => p.theme.space[5]}px;
  color: ${(p) => p.theme.colors.palette.neutral.c00};
  &:hover {
    opacity: 0.5;
  }
`;

const DismissWrapper = styled.div`
  color: white;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  padding: ${(p) => p.theme.space[13]}px;
  row-gap: ${(p) => p.theme.space[7]}px;
`;

export type Props = {
  timeout?: number;
  queue: SlideProps[];
  isDismissed: boolean;
  onDismiss: () => void;
};

const DEFAULT_TIMEOUT = 7000;
const Carousel = ({
  timeout = DEFAULT_TIMEOUT,
  queue,
  isDismissed,
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

  useEffect(() => {
    if (isDismissed) setWantToDismiss(false);
  }, [isDismissed]);

  if (!queue?.length || isDismissed) return null;

  return (
    <CarouselWrapper id={"carousel"} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {wantToDismiss ? (
        <DismissWrapper>
          <Text color="palette.neutral.c00" ff="Inter|Medium" fontSize={13}>
            {"This banner will not show up again until there is a new announcement"}
          </Text>
          <Flex>
            <Button color="palette.neutral.c00" type="secondary" onClick={onDismiss}>
              {"Confirm"}
            </Button>
            <Button color="palette.neutral.c00" type="primary" onClick={onCancelDismiss}>
              {"Show again"}
            </Button>
          </Flex>
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
