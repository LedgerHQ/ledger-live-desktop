// @flow

import React, { useMemo } from "react";
import styled from "styled-components";
import Box from "~/renderer/components/Box";

const Container = styled.div`
  ${p =>
    p.full
      ? `
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    `
      : `
      display: flex;
      flex: 1;
      position: relative;
    `}
`;

const ScrollContainer = styled.div`
  display: flex;
  flex-direction: column;
  ${p => p.theme.overflow.yAuto};
  ${p =>
    p.maxHeight
      ? `max-height:${p.maxHeight}px`
      : `bottom: 0;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;`}
`;

type Props = {
  children: any,
  full?: boolean,
  maxHeight?: number,
};

// $FlowFixMe
export const GrowScrollContext = React.createContext();

const GrowScroll = (
  { children, full = false, maxHeight, ...props }: Props,
  ref: React$ElementRef<any>,
) => {
  const valueProvider = useMemo(() => ({ scrollContainer: ref ? ref.current : null }), [ref]);

  return (
    <Container full={full}>
      <ScrollContainer maxHeight={maxHeight} ref={ref}>
        <Box {...props} grow>
          <GrowScrollContext.Provider value={valueProvider}>{children}</GrowScrollContext.Provider>
        </Box>
      </ScrollContainer>
    </Container>
  );
};

export default React.forwardRef<Props, *>(GrowScroll);
