import React from "react";
import Divider from "./index";
import Text from "@ui/components/Text";

export default {
  title: "Divider",
  component: Divider,
  argTypes: {
    type: {
      options: ["light", "dark"],
      control: {
        type: "select",
      },
    },
    margin: {
      type: "number",
    },
  },
};

const Template = args => (
  <div>
    <Text>
      {
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ante mauris, tempor faucibus urna quis, gravida vulputate nisl. Nam nec commodo dui. Quisque semper neque non risus elementum maximus. Nam molestie porttitor nibh, quis tempus quam maximus quis. Phasellus ultrices, leo nec pulvinar volutpat, ipsum purus lobortis metus, eu pharetra eros libero sed dui. Pellentesque in ligula lorem. In id vestibulum ligula. Aliquam quam tellus, ornare non molestie non, ornare vitae ex. Aliquam vel urna nec leo mattis iaculis. Maecenas velit metus, bibendum eu tincidunt et, rhoncus ac elit. Cras tristique quam vel mauris scelerisque aliquet. Donec dapibus lectus at nisi blandit, nec tristique ligula porttitor. Aliquam nec iaculis ex."
      }
    </Text>
    <Divider {...args} />
    <Text>
      {
        "Cras maximus orci eget sem elementum accumsan. Donec at mollis odio, a varius metus. Donec dapibus id elit vitae dignissim. Suspendisse consequat ex ut scelerisque imperdiet. Donec interdum lorem risus. Praesent consectetur lectus vel libero volutpat, id dictum sapien vulputate. Donec vulputate eros at nulla aliquet rutrum sit amet lacinia tortor. Ut pretium, purus eget sollicitudin finibus, eros dolor commodo libero, ut pellentesque mauris odio vitae sem. Nam ornare arcu sit amet posuere vestibulum. Donec eget felis sed erat placerat suscipit."
      }
    </Text>
  </div>
);

export const Default = Template.bind({});
