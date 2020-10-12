// @flow
import React, { useState, useRef, useCallback, useEffect } from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { Trans } from "react-i18next";
import { Base } from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";

const Tab = styled(Base)`
  padding: 0 16px 4px 16px;
  border-radius: 0;
  color: ${p =>
    p.active ? p.theme.colors.palette.text.shade100 : p.theme.colors.palette.text.shade50};
  &:hover,
  &:active,
  &:focus {
    background: none;
    color: ${p => p.theme.colors.palette.text.shade100};
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

const Tabs: ThemedComponent<{ short: boolean }> = styled.div`
  height: ${p => p.theme.sizes.topBarHeight}px;
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: flex-end;

  ${Tab}:first-child {
    ${p => (p.short ? "padding-left: 0;" : "")}
  }
`;

type Props = {
  tabs: string[],
  onIndexChange: number => void,
  defaultIndex?: number,
  index?: number,
  short?: boolean,
};

const TabBar = ({
  tabs,
  onIndexChange,
  defaultIndex = 0,
  short = false,
  index: propsIndex,
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
    <Tabs short={short}>
      {tabs.map((tab, j) => (
        <Tab
          ref={setTabRef(j)}
          key={`TAB_${j}_${tab}`}
          active={j === i}
          tabIndex={j}
          onClick={() => updateIndex(j)}
        >
          <Text ff="Inter|SemiBold" fontSize={5}>
            <Trans i18nKey={tab} />
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
