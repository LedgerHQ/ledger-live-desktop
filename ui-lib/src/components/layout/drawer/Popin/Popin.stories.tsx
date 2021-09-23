import React from "react";
import Popin from "./index";
import Text from "@ui/components/asorted/Text";
import theme from "@ui/styles/theme";
import { useArgs } from "@storybook/client-api";
export default {
  title: "Layout/Drawer/Popin",
  component: Popin,
  argTypes: {
    children: {
      type: "text",
      description: "Any valid React node",
      required: true,
      control: {
        type: "text",
      },
    },
    width: {
      type: "number",
      description: "Optional popin's width",
      default: theme.sizes.drawer.popin.min.width,
      control: {
        type: "number",
        min: theme.sizes.drawer.popin.min.width,
        max: theme.sizes.drawer.popin.max.width,
      },
      table: {
        type: {
          summary: "Accepted range",
          detail: `Value lower than ${theme.sizes.drawer.popin.min.width}px or greather than ${theme.sizes.drawer.popin.max.width}px will have no effect because of min/max css rules.`,
        },
        defaultValue: {
          summary: theme.sizes.drawer.popin.min.width,
        },
      },
    },
    height: {
      type: "number",
      description: "Optional popin's height",
      control: {
        type: "number",
        min: theme.sizes.drawer.popin.min.height,
        max: theme.sizes.drawer.popin.max.height,
      },
      table: {
        type: {
          summary: "Accepted range",
          detail: `Value lower than ${theme.sizes.drawer.popin.min.height}px or greather than ${theme.sizes.drawer.popin.max.height}px will have no effect because of min/max css rules.`,
        },
        defaultValue: {
          summary: theme.sizes.drawer.popin.min.height,
        },
      },
    },
    isOpen: {
      type: "boolean",
      value: true,
      description: "Controls if the popin is rendered.",
      required: true,
      control: {
        type: "boolean",
      },
    },
    onClose: {
      description: "Unmount popin component",
      control: false,
    },
  },
};

const Template = (args: any) => {
  const [, updateArgs] = useArgs();

  /* Allow interactive controls from the story. Thanks to this, triggering onClose
   ** function from the component itself (by clicking on the cross icon e.g.)
   ** will update the value of the isOpen props.
   */
  const onClose = () =>
    updateArgs({
      isOpen: false,
    });

  return (
    <Popin {...args} onClose={onClose}>
      <Text>{args.children}</Text>
    </Popin>
  );
};

export const Default = Template.bind({});
// @ts-expect-error FIXME
Default.args = {
  children: "I'm the content passed as a children to the popin component",
};
