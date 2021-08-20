import React from "react";
import Tag, { Props } from "./index";

export default {
  title: "Tags/Tag",
  component: Tag,
  argTypes: {
    active: {
      control: {
        type: "boolean",
      },
    },
    type: {
      options: ["plain", "translucent", "outlined"],
    },
    children: {
      type: "string",
    },
  },
};

const Template = (args: Props): JSX.Element => <Tag {...args}>{args.children}</Tag>;
const defaultArgs = {
  active: true,
  children: "Label",
};

export const Plain = Template.bind({});
Plain.args = {
  ...defaultArgs,
  type: "plain",
};
export const Translucent = Template.bind({});
Translucent.args = {
  ...defaultArgs,
  type: "translucent",
};
export const Outlined = Template.bind({});
Outlined.args = {
  ...defaultArgs,
  type: "outlined",
};
