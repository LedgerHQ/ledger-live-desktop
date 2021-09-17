import React from "react";
import Flex from "./index";
import styled from "styled-components";
export default {
  title: "Layout/Flex",
  component: Flex,
  argTypes: {
    children: {
      type: "text",
      description: "Any valid React node",
      required: true,
      control: false,
    },
    alignItems: {
      type: "text",
      description:
        "This defines the default behavior for how flex items are laid out along the cross axis on the current line. Think of it as the justify-content version for the cross-axis (perpendicular to the main-axis).",
      required: false,
      options: [
        "stretch",
        "flex-start",
        "flex-end",
        "center",
        "baseline",
        "first baseline",
        "last baseline",
        "start",
        "end",
        "self-start",
        "self-end",
        "safe center",
        "unsafe center",
      ],
      control: {
        type: "select",
      },
      table: {
        category: "Parent",
        subcategory: "cross-axis",
      },
    },
    flexDirection: {
      type: "text",
      description:
        "This establishes the main-axis, thus defining the direction flex items are placed in the flex container. Think of flex items as primarily laying out either in horizontal rows or vertical columns.",
      required: false,
      options: ["row", "row-reverse", "column", "column-reverse"],
      control: {
        type: "select",
      },
      table: {
        category: "Parent",
        subcategory: "main-axis",
      },
    },
    justifyItems: {
      type: "text",
      description:
        "This defines the default justify-self for all items of the box, giving them all a default way of justifying each box along the appropriate axis.",
      required: false,
      options: [
        "flex-start",
        "flex-end",
        "center",
        "space-between",
        "space-around",
        "space-evenly",
        "stretch",
        "start",
        "end",
        "baseline",
        "first baseline",
        "last baseline",
        "safe center",
        "unsafe center",
      ],
      control: {
        type: "select",
      },
      table: {
        category: "Parent",
      },
    },
    justifyContent: {
      type: "text",
      description:
        "This defines the alignment along the main axis. It helps distribute extra free space leftover when either all the flex items on a line are inflexible, or are flexible but have reached their maximum size. It also exerts some control over the alignment of items when they overflow the line.",
      required: false,
      options: [
        "flex-start",
        "flex-end",
        "center",
        "space-between",
        "space-around",
        "space-evenly",
        "stretch",
        "start",
        "end",
        "left",
        "right",
        "safe center",
        "unsafe center",
      ],
      control: {
        type: "select",
      },
      table: {
        category: "Parent",
        subcategory: "main-axis",
      },
    },
    flexWrap: {
      type: "text",
      description:
        "By default, flex items will all try to fit onto one line. You can change that and allow the items to wrap as needed with this property.",
      required: false,
      options: ["nowrap", "wrap", "wrap-reverse"],
      control: {
        type: "select",
      },
      table: {
        category: "Parent",
      },
    },
    flex: {
      type: "text",
      description:
        "This is the shorthand for flex-grow, flex-shrink and flex-basis combined. The second and third parameters (flex-shrink and flex-basis) are optional. The default is 0 1 auto, but if you set it with a single number value, it’s like 1 0.",
      required: false,
      control: {
        type: "text",
      },
      table: {
        category: "Children",
      },
    },
    flexGrow: {
      type: "text",
      description:
        "This defines the ability for a flex item to grow if necessary. It accepts a unitless value that serves as a proportion. It dictates what amount of the available space inside the flex container the item should take up.",
      required: false,
      control: {
        type: "number",
      },
      table: {
        category: "Children",
      },
    },
    flexShrink: {
      type: "text",
      description: "This defines the ability for a flex item to shrink if necessary.",
      required: false,
      control: {
        type: "number",
      },
      table: {
        category: "Children",
      },
    },
    flexBasis: {
      type: "text",
      description:
        "This defines the default size of an element before the remaining space is distributed. It can be a length (e.g. 20%, 5rem, etc.) or a keyword. The auto keyword means “look at my width or height property” (which was temporarily done by the main-size keyword until deprecated).",
      required: false,
      control: {
        type: "number",
      },
      table: {
        category: "Children",
      },
    },
    justifySelf: {
      type: "text",
      description:
        "This  sets the way a box is justified inside its alignment container along the appropriate axis.",
      required: false,
      options: [
        "flex-start",
        "flex-end",
        "center",
        "space-between",
        "space-around",
        "space-evenly",
        "stretch",
        "start",
        "end",
        "baseline",
        "first baseline",
        "last baseline",
        "safe center",
        "unsafe center",
      ],
      control: {
        type: "select",
      },
      table: {
        category: "Children",
      },
    },
    alignContent: {
      type: "text",
      description:
        "This aligns a flex container’s lines within when there is extra space in the cross-axis, similar to how justify-content aligns individual items within the main-axis.",
      required: false,
      options: [
        "flex-start",
        "flex-end",
        "center",
        "space-between",
        "space-around",
        "space-evenly",
        "stretch",
        "start",
        "end",
        "baseline",
        "first baseline",
        "last baseline",
        "safe center",
        "unsafe center",
      ],
      control: {
        type: "select",
      },
      table: {
        category: "Parent",
        subcategory: "cross-axis",
      },
    },
    alignSelf: {
      type: "text",
      description:
        "This allows the default alignment (or the one specified by align-items) to be overridden for individual flex items.",
      required: false,
      options: [
        "flex-start",
        "flex-end",
        "center",
        "space-between",
        "space-around",
        "space-evenly",
        "stretch",
        "start",
        "end",
        "baseline",
        "first baseline",
        "last baseline",
        "safe center",
        "unsafe center",
      ],
      control: {
        type: "select",
      },
      table: {
        category: "Children",
      },
    },
    order: {
      type: "text",
      description:
        "By default, flex items are laid out in the source order. However, the order property controls the order in which they appear in the flex container.",
      required: false,
      control: {
        type: "number",
      },
      table: {
        category: "Children",
      },
    },
    rowGap: {
      type: "text",
      description:
        "The row-gap CSS property sets the size of the gap (gutter) between an element's flex rows.",
      required: false,
      control: { type: "text" },
      table: { category: "Parent" },
    },
    columnGap: {
      type: "text",
      description:
        "The column-gap CSS property sets the size of the gap (gutter) between an element's flex columns.",
      required: false,
      control: { type: "text" },
      table: { category: "Parent" },
    },
  },
};
/*
 ** Template component creates a sandbox to play with Flexbox properties.
 ** Children Flexbox props are passed to the first Square child, that allow
 ** you to play with the flexbox properties for children.
 */

const Square = styled.div<any>`
  width: 25vw;
  height: 25vw;
  padding: 1rem;
  color: white;
  font-weight: 700;
  ${(props) => props};
`;

const Template = (args: any) => (
  <Flex
    {...args}
    style={{
      width: "100vw",
      height: "100vh",
    }}
  >
    <Square {...args} backgroundColor="darkslategray">
      Control me with flex children props
    </Square>
    <Square backgroundColor="lightslategray" />
    <Square backgroundColor="darkgray" />
  </Flex>
);

export const Default = Template.bind({});
