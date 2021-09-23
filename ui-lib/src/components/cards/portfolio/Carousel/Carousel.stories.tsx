import React from "react";
import { useArgs } from "@storybook/client-api";

import Carousel from "./";
import image from "../../../../assets/images/sampleSlide.png";
export default {
  title: "Cards/Portfolio/Carousel",
  argTypes: {
    isDismissed: {
      description: "App level setting to determine visibility of the component",
      control: {
        type: "boolean",
        defaultValue: { summary: false },
      },
    },
    timeout: {
      description: "Timeout for auto-slide in ms",
      control: {
        type: "number",
        min: 1000,
        max: 20000,
        defaultValue: { summary: 7000 },
      },
      table: {
        type: { summary: "number" },
        defaultValue: { summary: 7000 },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `The carousel is used to showcase products and features to our users. It's a dismissable component that should be re-enabled from the settings of the app. By default, it auto loops through a series of slides but this is paused when the mouse enters the bounds of the slide.<br/>
        The current version is missing the updated color palette and translatable strings.`,
      },
    },
  },
};

const Template = (args: any) => {
  const queue = [
    {
      title: "NEW PRODUCT 1",
      description: "Enhance your security with the new ledger nano x available now!",
      image,
      onClick: () => alert("Clicked on banner 1"),
    },
    {
      title: "NEW PRODUCT 2",
      description: "Enhance your security with the new ledger nano x available now!",
      image,
      onClick: () => alert("Clicked on banner 2"),
    },
    {
      title: "NEW PRODUCT 3",
      description: "Enhance your security with the new ledger nano x available now!",
      image,
      onClick: () => alert("Clicked on banner 3"),
    },
    {
      title: "NEW PRODUCT 4",
      description: "Enhance your security with the new ledger nano x available now!",
      image,
      onClick: () => alert("Clicked on banner 4"),
    },
  ];

  const [, updateArgs] = useArgs();

  const onDismiss = () =>
    updateArgs({
      isDismissed: true,
    });

  return <Carousel queue={queue} onDismiss={onDismiss} {...args} />;
};

export const Default = Template.bind({});
