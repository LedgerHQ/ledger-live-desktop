// @flow
import React, { useState, useRef, useCallback, useEffect } from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { Base } from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";

const Tab = styled(Base)`
  padding: 0 16px 4px 16px;
  border-radius: 0;
  flex: ${({ fullWidth }) => (fullWidth ? "1" : "initial")};
  display: flex;
  justify-content: center;
  color: ${p =>
    p.active ? p.theme.colors.palette.text.shade100 : p.theme.colors.palette.text.shade50};
  &:hover,
  &:active,
  &:focus {
    background: none;
    color: ${p => p.theme.colors.palette.text.shade100};
  }

  > * {
    font-size: ${p => p.fontSize}px;
  }
`;

const TabIndicator = styled.span.attrs(({ currentRef = {}, index, short }) => ({
  style: {
    width: `${currentRef.clientWidth - (short && index === 0 ? 16 : 32)}px`,
    transform: `translateX(${currentRef.offsetLeft}px)`,
  },
}))`
  height: 3px;
  position: absolute;
  bottom: 0;
  left: ${p => (p.short && p.index === 0 ? 0 : "16px")};
  background-color: ${p => p.theme.colors.palette.primary.main};
  transition: all 0.3s ease-in-out;
`;

const Tabs: ThemedComponent<{ short: boolean, separator: boolean }> = styled.div`
  height: ${p => p.height || p.theme.sizes.topBarHeight}px;
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: flex-end;

  ${Tab}:first-child {
    ${p => (p.short ? "padding-left: 0;" : "")}
  }

  ${p =>
    p.separator
      ? `
    &:after {
    background: ${p.theme.colors.palette.divider};
    content: "";
    display: block;
    height: 1px;
    left: 0;
    position: absolute;
    right: 0;
    bottom: 0;
  }

  `
      : ""}
`;

type Props = {
  tabs: string[],
  ids?: string[],
  onIndexChange: number => void,
  defaultIndex?: number,
  index?: number,
  short?: boolean,
  separator?: boolean,
  withId?: boolean,
  fontSize?: number,
  fullWidth?: boolean,
  height?: number,
};

const TabBar = ({
  tabs,
  ids,
  onIndexChange,
  defaultIndex = 0,
  short = false,
  index: propsIndex,
  fullWidth = false,
  separator = false,
  withId = false,
  fontSize = 16,
  height,
}: Props) => {
  const tabRefs = useRef([]);
  const [index, setIndex] = useState(defaultIndex);
  const [mounted, setMounted] = useState(false);

  const i = !isNaN(propsIndex) && propsIndex !== undefined ? propsIndex : index;

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateIndex = useCallback(
    j => {
      setIndex(j);
      onIndexChange(j);
    },
    [setIndex, onIndexChange],
  );

  const setTabRef = index => ref => {
    tabRefs.current[index] = ref;
  };

  return (
    <Tabs short={short} separator={separator} height={height}>
      {tabs.map((tab, j) => (
        <Tab
          ref={setTabRef(j)}
          key={`TAB_${j}_${tab}`}
          active={j === i}
          fullWidth={fullWidth}
          tabIndex={j}
          onClick={() => updateIndex(j)}
          data-test-id={withId && ids?.length ? `${ids[j]}-tab` : ""}
          fontSize={fontSize}
        >
          <Text ff="Inter|SemiBold" fontSize={5}>
            {tab}
          </Text>
        </Tab>
      ))}
      {mounted && tabRefs.current[i] && (
        <TabIndicator short={short} index={i} currentRef={tabRefs.current[i]} />
      )}
    </Tabs>
  );
};

export default TabBar;
