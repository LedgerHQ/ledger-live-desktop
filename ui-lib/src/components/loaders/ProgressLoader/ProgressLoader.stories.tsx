import ProgressLoader from "./index";
export default {
  title: "Loaders/ProgressLoader",
  component: ProgressLoader,
  argTypes: {
    radius: {
      control: {
        type: "number",
      },
      defaultValue: 32,
    },
    progress: {
      control: {
        type: "number",
      },
      defaultValue: 20,
    },
    stroke: {
      control: {
        type: "number",
      },
      defaultValue: 6,
    },
  },
};

export const Default = (args: {
  radius: number;
  progress: number;
  stroke: number;
}): JSX.Element => {
  return <ProgressLoader radius={args.radius} progress={args.progress} stroke={args.stroke} />;
};
