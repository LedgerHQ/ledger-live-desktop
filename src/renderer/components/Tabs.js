// @flow
import React, { useCallback, useRef, useState } from "react";
import { Transition } from "react-transition-group";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import styled from "styled-components";
import TabBar from "./TabBar";

const timing = 200;

const Root: ThemedComponent<*> = styled.div`
  width: 100%;
  position: relative;
  margin-bottom: ${p => p.theme.space[3]}px;
`;

const TabsContainer: ThemedComponent<*> = styled.div`
  position: relative;
  min-height: calc(100vh - 150px);
`;

const TabHeader = styled.div`
  position: sticky;
  inset: ${p => -p.theme.space[3]}px 0 0 0;
  background-color: ${p => p.theme.colors.palette.background.paper};
  z-index: 100;
`;

const transitions = {
  entering: { opacity: 0, maxHeight: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0, maxHeight: 0 },
  exited: { opacity: 0, maxHeight: 0, display: "none" },
};

const Tab: ThemedComponent<{ state: string }> = styled.div.attrs(({ state }) => ({
  style: transitions[state],
}))`
  width: 100%;
`;

type Props = {
  tabs: { label: string, content: React$Node }[],
  unmountOnExit?: boolean,
};

export default function Tabs({ tabs, unmountOnExit }: Props) {
  const ref = useRef();
  const labels = tabs.map(({ label }) => label);
  const contents = tabs.map(({ content }) => content);
  const [activeIndex, setActiveIndex] = useState(0);

  const onIndexChange = useCallback(index => {
    if (ref && ref.current && ref.current.getBoundingClientRect) {
      const { top } = ref.current.getBoundingClientRect();
      if (top <= 58 && ref.current && ref.current.scrollIntoView)
        ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setActiveIndex(index);
  }, []);

  return (
    <Root ref={ref}>
      <TabHeader>
        <TabBar defaultIndex={activeIndex} tabs={labels} onIndexChange={onIndexChange} />
      </TabHeader>
      <TabsContainer>
        {contents.map((tab, i) => (
          <Transition
            key={i}
            in={activeIndex === i}
            timeout={{
              appear: 0,
              enter: timing,
              exit: timing * 3, // leaves extra time for the animation to end before unmount
            }}
            mountOnEnter
          >
            {state => <Tab state={state}>{tab}</Tab>}
          </Transition>
        ))}
      </TabsContainer>
    </Root>
  );
}
