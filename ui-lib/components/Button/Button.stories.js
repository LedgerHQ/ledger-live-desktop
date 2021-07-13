import React from "react";

import Button, { ExpandButton } from "./index";

import AccountAdd from "../../icons/AccountAdd";

export default {
  title: "Buttons/Button",
  component: Button,
  argTypes: {
    type: {
      options: [undefined, "primary", "secondary"],
      control: { type: "radio" },
    },
    fontSize: { options: [undefined, 0, 1, 2, 3, 4, 5, 6, 7, 8], control: { type: "radio" } },
    children: { type: "text" },
    iconPosition: { options: ["right", "left"], control: { type: "radio" } },
    disabled: { type: "boolean" },
  },
};

const Template = args => <Button {...args}>{args.children}</Button>;
export const Default = Template.bind({});
Default.args = {
  children: "Label",
};

export const IconButton = Template.bind({});
IconButton.args = {
  children: "",
  Icon: AccountAdd,
  iconPosition: "right",
};

const ExpandTemplate = args => {
  const [show, setShow] = React.useState(false);

  return (
    <>
      <ExpandButton {...args} onToggle={setShow}>
        {args.children}
      </ExpandButton>
      {show && <div style={{ padding: "1rem" }}>Hello world!</div>}
    </>
  );
};
export const Expand = ExpandTemplate.bind({});
Expand.args = {
  children: "Show all",
};
