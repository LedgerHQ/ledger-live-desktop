// @flow
import React, { useEffect } from "react";

import Drawer from "./index";
import DrawerProvider, { setDrawer } from "./Provider";
import Button from "@ui/components/Button";
import styled from "styled-components";
import type { ThemedComponent } from "@ui/styles/StyleProvider";
import { useArgs } from "@storybook/client-api";

const DummyContentWrapper: ThemedComponent<*> = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${p => p.color};
  align-items: center;
  padding: 10px;
`;

export default {
  title: "Layout/Drawer",
  component: Drawer,
  argTypes: {
    title: {
      type: "text",
      description: "Drawer default title",
      defaultValue: "Default title",
      control: { type: "text" },
      required: false,
    },
    big: {
      type: "boolean",
      value: true,
      description: "Larger width side drawer.",
      required: false,
      control: { type: "boolean" },
    },
  },
};

const Template = (args: any) => {
  const [, updateArgs] = useArgs();

  const onClose = () => updateArgs({ isOpen: false });
  const onBackLvl1 = () => setDrawer(DummyContent, { left: true });
  const onBackLvl2 = () => setDrawer(DummySubContentLvl1, { onBack: onBackLvl1, left: true });

  const DummyContent = () => (
    <DummyContentWrapper color={"#957DAD"}>
      <Button onClick={() => setDrawer(DummySubContentLvl1, { onBack: onBackLvl1, left: true })}>
        {"Go to level 2"}
      </Button>
    </DummyContentWrapper>
  );
  const DummySubContentLvl1 = () => (
    <DummyContentWrapper color={"#E0BBE4"}>
      <Button onClick={() => setDrawer(DummySubContentLvl2, { onBack: onBackLvl2, left: true })}>
        {"Go to level 3"}
      </Button>
    </DummyContentWrapper>
  );
  const DummySubContentLvl2 = () => <DummyContentWrapper color={"#FEC8D8"} />;

  useEffect(() => {
    setDrawer(DummyContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DrawerProvider>
      <Drawer {...args} onClose={onClose}>
        {args.children}
      </Drawer>
    </DrawerProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};
