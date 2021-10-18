// @flow
import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { alwaysShowSkeletonsSelector } from "~/renderer/reducers/application";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { space } from "styled-system";
type Props = {
  width?: number,
  height?: number,
  full?: boolean,
  mt?: any,
  status?: "loading" | "loaded",
  children?: React$Node,
  show?: boolean,
};

const Wrapper: ThemedComponent<{}> = styled.div`
  ${space};
  aspect-ratio: ${p => (p.full ? 1 : "auto")};
  width: ${p => (p.full ? "100%" : p.width ? `${p.width}px` : "auto")};
  height: ${p => (p.full || !p.height ? "auto" : `${p.height}px`)};
  position: relative;
`;

const Item: ThemedComponent<{}> = styled.div.attrs(({ state }) => ({
  style: transitionStyles[state],
}))`
  position: absolute;
  display: inline-block;

  &:empty {
    overflow: hidden;
    border-radius: 3px;
    background: hsla(207, 44%, 14%, 0.1);
    width: 100%;
    height: 100%;
  }
  &:empty::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background: linear-gradient(to left, #fff0, #fff4 50%, #fff0 100%);
    animation: shimmer 2s infinite;
    content: "";
  }

  top: 50%;
  transform: translateY(-50%);
  ${p => (p.state === "entering" ? "animation: fadeIn 5s;" : "")}
  transition: all 1000ms linear;
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
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

const Skeleton = ({ width, height, full, children, status, mt, show }: Props) => {
  const alwaysShowSkeletons = useSelector(alwaysShowSkeletonsSelector);
  const isSkeletonVisible = show || alwaysShowSkeletons;
  const content = isSkeletonVisible ?? (isSkeletonVisible || !children) ? "" : children;
  const key = content ? "content" : "holder";

  return (
    <Wrapper width={width} height={height} full={full} mt={mt}>
      <TransitionGroup>
        <CSSTransition in key={key} timeout={{ appear: 5000, enter: 5000, exit: 5000 }}>
          {state => (
            <Item state={state} fill={!width}>
              {content}
            </Item>
          )}
        </CSSTransition>
      </TransitionGroup>
    </Wrapper>
  );
};

export default Skeleton;
