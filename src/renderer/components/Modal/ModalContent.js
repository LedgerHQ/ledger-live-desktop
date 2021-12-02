// @flow

import React, { useState, useLayoutEffect, useCallback } from "react";
import styled from "styled-components";

const ContentWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ContentScrollableContainer = styled.div`
  padding: 20px ${p => (p.noScroll ? 20 : 20 - p.theme.overflow.trackSize)}px 40px 20px;
  ${p => (p.noScroll ? "overflow:hidden" : p.theme.overflow.xy)};
  position: relative;
  flex: 0 auto;
`;

const ContentScrollableContainerGradient = styled.div.attrs(p => ({
  style: {
    opacity: p.opacity,
  },
}))`
  background: linear-gradient(
    rgba(255, 255, 255, 0),
    ${p => p.theme.colors.palette.background.paper}
  );
  transition: opacity 150ms;
  height: 40px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
`;

type Props = {
  children: any,
  noScroll?: boolean,
};

const ModalContent: React$ComponentType<Props> = React.forwardRef(function ModalContent(
  { children, noScroll }: Props,
  containerRef: React$ElementRef<*>,
) {
  const [isScrollable, setScrollable] = useState(false);

  const onHeightUpdate = useCallback(() => {
    // $FlowFixMe help me
    const { current } = containerRef;
    if (!current) return;
    setScrollable(current.scrollHeight > current.clientHeight);
  }, [containerRef]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(onHeightUpdate);
    ro.observe(containerRef.current);
    return () => {
      ro.disconnect();
    };
  }, [containerRef, onHeightUpdate]);
  return (
    <ContentWrapper>
      <ContentScrollableContainer
        ref={containerRef}
        noScroll={noScroll}
        data-test-id="modal-content"
      >
        {children}
      </ContentScrollableContainer>
      <ContentScrollableContainerGradient opacity={isScrollable && !noScroll ? 1 : 0} />
    </ContentWrapper>
  );
});

export default ModalContent;
