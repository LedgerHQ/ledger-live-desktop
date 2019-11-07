// @flow

/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react'
import styled from 'styled-components'

const ContentWrapper = styled.div`
  position: relative;
  flex: 0;
  display: flex;
  flex-direction: column;
`

const ContentScrollableContainer = styled.div`
  padding: 20px 20px 40px;
  overflow: ${p => (p.noScroll ? 'visible' : 'auto')};
  position: relative;
  flex: 0;
`

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
`

type Props = {
  children: any,
  noScroll?: boolean,
}

const ModalContent = React.forwardRef(({ children, noScroll }: Props, containerRef) => {
  const [isScrollable, setScrollable] = useState(false)

  const onHeightUpdate = useCallback(() => {
    setScrollable(containerRef.scrollHeight > containerRef.clientHeight)
  }, [containerRef])

  useLayoutEffect(() => {
    const ro = new ResizeObserver(onHeightUpdate)
    if (containerRef.current) {
      ro.observe(containerRef.current)
    }
    return () => {
      ro.disconnect()
    }
  }, [containerRef, onHeightUpdate])

  useEffect(() => {}, [isScrollable])

  return (
    <ContentWrapper>
      <ContentScrollableContainer ref={containerRef} tabIndex={0} noScroll={noScroll}>
        {children}
      </ContentScrollableContainer>
      <ContentScrollableContainerGradient opacity={isScrollable ? 1 : 0} />
    </ContentWrapper>
  )
})

export default ModalContent
