import React from "react";
import Button, { ExpandButton } from "./index";
import AccountAdd from "../../assets/icons/AccountAdd";
export default {
  title: "Buttons/Button",
  component: Button,
  argTypes: {
    type: {
      options: [undefined, "primary", "secondary"],
      control: {
        type: "radio",
      },
    },
    fontSize: {
      options: [undefined, 0, 1, 2, 3, 4, 5, 6, 7, 8],
      control: {
        type: "radio",
      },
    },
    children: {
      type: "text",
    },
    iconPosition: {
      options: ["right", "left"],
      control: {
        type: "radio",
      },
    },
    disabled: {
      type: "boolean",
    },
  },
};

// @ts-expect-error
const Template = args => <Button {...args}>{args.children}</Button>;

export const Default = Template.bind({});
// @ts-expect-error
Default.args = {
  children: "Label",
};
export const IconButton = Template.bind({});
// @ts-expect-error
IconButton.args = {
  children: "",
  Icon: AccountAdd,
  iconPosition: "right",
};

const ExpandTemplate = (args: any) => {
  const [show, setShow] = React.useState(false);
  return (
    <>
      <ExpandButton {...args} onToggle={setShow}>
        {args.children}
      </ExpandButton>
      {show && (
        <div
          style={{
            padding: "1rem",
          }}
        >
          Hello world!
        </div>
      )}
    </>
  );
};

export const Expand = ExpandTemplate.bind({});
// @ts-expect-error
Expand.args = {
  children: "Show all",
};
