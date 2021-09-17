import React from "react";
import Icon, { iconNames } from "@ui/components/Icon";

const Story = {
  title: "Meta/Icons",
  argTypes: {
    weight: {
      type: "enum",
      description: "Weight",
      defaultValue: "Regular",
      control: {
        options: ["Light", "Medium", "Regular", "Thin", "UltraLight"],
        control: {
          type: "select",
        },
      },
    },
    size: {
      type: "number",
      description: "Icon size for preview",
      defaultValue: 32,
    },
    color: {
      type: "text",
      description: "Color",
      defaultValue: "#000",
    },
    name: {
      type: "enum",
      defaultValue: "Activity",
      description: "[Only for single icon], Icon name",
      control: {
        options: iconNames,
        control: {
          type: "select",
        },
      },
    },
  },
};
export default Story;

const ListTemplate = (args) => (
  <div>
    {iconNames.map((name) => (
      <span title={name}>
        <Icon key={name} name={name} weight={args.weight} size={args.size} color={args.color} />
      </span>
    ))}
  </div>
);
const IconTemplate = (args) => <Icon {...args} />;

export const List = ListTemplate.bind({});
export const SingleIcon = IconTemplate.bind({});
