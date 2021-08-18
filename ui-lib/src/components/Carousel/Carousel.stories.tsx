import React from "react";
import Carousel from "./";
import image from "../../assets/images/sampleSlide.png";
export default {
  title: "Portfolio/Carousel",
  argTypes: {
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
        The current version is missing the updated color palette, the slide link and the functionality of dimissing the whole thing.`,
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
    },
    {
      title: "NEW PRODUCT 2",
      description: "Enhance your security with the new ledger nano x available now!",
      image,
    },
    {
      title: "NEW PRODUCT 3",
      description: "Enhance your security with the new ledger nano x available now!",
      image,
    },
    {
      title: "NEW PRODUCT 4",
      description: "Enhance your security with the new ledger nano x available now!",
      image,
    },
  ];

  return <Carousel queue={queue} {...args} />;
};

export const Default = Template.bind({});
