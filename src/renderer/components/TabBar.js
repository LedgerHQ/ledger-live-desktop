// @flow
import React, { useState, useRef, useCallback, useEffect } from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { Trans } from "react-i18next";
import { Base } from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";

const Tabs: ThemedComponent<*> = styled.div`
  height: ${p => p.theme.sizes.topBarHeight}px;
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: flex-end;
`;

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

const TabIndicator = styled.span.attrs(({ currentRef = {} }) => ({
  style: {
    width: `${currentRef.clientWidth - 32}px`,
    transform: `translateX(${currentRef.offsetLeft}px)`,
  },
}))`
  height: 3px;
  position: absolute;
  bottom: 0;
  left: 16px;
  background-color: ${p => p.theme.colors.palette.primary.main};
  transition: all 0.3s ease-in-out;
`;

type Props = {
  tabs: string[],
  onIndexChange: number => void,
  defaultIndex?: number,
};

const TabBar = ({ tabs, onIndexChange, defaultIndex = 0 }: Props) => {
  const tabRefs = useRef([]);
  const [index, setIndex] = useState(defaultIndex);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateIndex = useCallback(
    i => {
      setIndex(i);
      onIndexChange(i);
    },
    [setIndex, onIndexChange],
  );

  const setTabRef = index => ref => {
    tabRefs.current[index] = ref;
  };

  return (
    <Tabs>
      {tabs.map((tab, i) => (
        <Tab
          ref={setTabRef(i)}
          key={`TAB_${i}_${tab}`}
          active={i === index}
          tabIndex={i}
          onClick={() => updateIndex(i)}
        >
          <Text ff="Inter|SemiBold" fontSize={5}>
            <Trans i18nKey={tab} />
          </Text>
        </Tab>
      ))}
      {mounted && tabRefs.current[index] && <TabIndicator currentRef={tabRefs.current[index]} />}
    </Tabs>
  );
};

export default TabBar;
