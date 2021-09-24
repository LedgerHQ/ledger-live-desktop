import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import Button from "@ui/components/cta/Button";
import Side from "./index";
import SideProvider, { setSide } from "./Provider";
import { lipsum } from "../../../../helpers";

const DummyContentWrapper = styled.div`
  width: 100%;
  background-color: ${(p) => p.color};
  align-items: center;
  padding: ${(p) => p.theme.space[4]}px;
`;

const onBackLvl1 = () =>
  setSide(DummyContent, {
    left: true,
  });

const onBackLvl2 = () =>
  setSide(DummySubContentLvl1, {
    onBack: onBackLvl1,
    left: true,
  });

const DummyContent = () => (
  <DummyContentWrapper color={"#957DAD"}>
    <Button
      onClick={() =>
        setSide(DummySubContentLvl1, {
          onBack: onBackLvl1,
          left: true,
        })
      }
    >
      {"Go to level 2"}
    </Button>
  </DummyContentWrapper>
);

const DummySubContentLvl1 = () => (
  <DummyContentWrapper color={"#E0BBE4"}>
    <Button
      onClick={() =>
        setSide(DummySubContentLvl2, {
          onBack: onBackLvl2,
          left: true,
        })
      }
    >
      {"Go to level 3"}
    </Button>
    <div>{lipsum}</div>
  </DummyContentWrapper>
);

const DummySubContentLvl2 = () => (
  <DummyContentWrapper color={"#FEC8D8"}>
    <div>{lipsum}</div>
  </DummyContentWrapper>
);

const components = {
  DummyContent,
  DummySubContentLvl1,
  DummySubContentLvl2,
};
export default {
  title: "Layout/Drawer/Side",
  component: Side,
  argTypes: {
    isOpen: {
      type: "boolean",
      value: true,
      description: "Is open",
      required: false,
      control: {
        type: "boolean",
      },
    },
    title: {
      type: "text",
      description: "Side default title",
      defaultValue: "Default title",
      control: {
        type: "text",
      },
      required: false,
    },
    big: {
      type: "boolean",
      value: true,
      description: "Larger width side drawer.",
      required: false,
      control: {
        type: "boolean",
      },
    },
  },
};

const Template = (args) => {
  const onClose = useCallback(() => setSide(null), []);
  const onOpen = useCallback(() => setSide(components.DummyContent), []);

  useEffect(() => {
    if (args.isOpen) onOpen();
    if (!args.isOpen) onClose();
  }, [args.isOpen, onClose, onOpen]);

  return (
    <SideProvider>
      <Side {...args} onClose={onClose}>
        {args.children}
      </Side>
    </SideProvider>
  );
};

export const Default = Template.bind({});
// @ts-expect-error FIXME
Default.args = {};
