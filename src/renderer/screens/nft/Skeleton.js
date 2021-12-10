// @flow
import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { alwaysShowSkeletonsSelector } from "~/renderer/reducers/application";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { layout, space } from "styled-system";
type Props = {
  width?: number,
  minHeight?: number,
  barHeight?: number,
  full?: boolean,
  mt?: any,
  status?: "loading" | "loaded",
  children?: React$Node,
  show?: boolean,
};

const Wrapper: ThemedComponent<{}> = styled.div`
  ${layout};
  ${space};
  ${p => (p.full ? "aspect-ratio: 1; height: auto;" : "")}
  ${p => (p.full ? "width: 100%;" : "")}
  align-items: center;
  display: grid;
`;

const Item: ThemedComponent<{}> = styled.div.attrs(({ state }) => ({
  style: transitionStyles[state],
}))`
  display: block;
  grid-column: 1/2;
  grid-row: 1/2;

  &.skeleton-enter {
    opacity: 0;
  }

  &.skeleton-enter-active {
    opacity: 1;
    transition: opacity 1s ease-in;
  }

  &.skeleton-exit {
    opacity: 1;
  }
  &.skeleton-exit-active {
    opacity: 0;
    transition: opacity 1s;
  }

  &:empty {
    position: relative;
    overflow: hidden;
    border-radius: 3px;
    background: hsla(207, 44%, 14%, 0.1);
    height: ${p => (p.full ? "100%" : `${p.minHeight}px`)};
    width: ${p => (p.full ? "100%" : `${p.width}px`)};
    aspect-ratio: ${p => (p.full ? 1 : "auto")};
  }

  &:empty::after {
    ${"" /* This is the shine that goes through the skeleton */}
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    transform: translateX(-100%);
    background: linear-gradient(to left, #fff0, #fff4 50%, #fff0 100%);
    animation: shimmer 2s infinite;
    content: "";
  }
  transition: opacity 1000ms linear;

  @keyframes shimmer {
    30% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

const Skeleton = ({ width, barHeight, minHeight, full, children, status, mt, show }: Props) => {
  const alwaysShowSkeletons = useSelector(alwaysShowSkeletonsSelector);
  const isSkeletonVisible = show || alwaysShowSkeletons;
  const content = isSkeletonVisible ?? (isSkeletonVisible || !children) ? "" : children;
  const key = content ? "content" : "holder";

  return (
    <Wrapper minHeight={minHeight} full={full} mt={mt}>
      <TransitionGroup component={null}>
        <CSSTransition in appear key={key} timeout={1000} classNames="skeleton">
          <Item full={full} width={width} minHeight={barHeight || minHeight}>
            {content}
          </Item>
        </CSSTransition>
      </TransitionGroup>
    </Wrapper>
  );
};

export default Skeleton;
