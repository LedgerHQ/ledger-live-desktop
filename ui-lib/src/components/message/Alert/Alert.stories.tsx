import Alert, { AlertProps } from "./index";
export default {
  title: "Messages/Alerts",
  argTypes: {
    type: {
      options: ["info", "warning", "error"],
      control: {
        type: "radio",
      },
    },
    title: {
      control: {
        type: "text",
      },
      defaultValue: "Label",
    },
    showIcon: {
      control: {
        type: "boolean",
      },
      defaultValue: true,
    },
  },
};

export const Default = (args: AlertProps): JSX.Element => {
  return <Alert {...args} />;
};
