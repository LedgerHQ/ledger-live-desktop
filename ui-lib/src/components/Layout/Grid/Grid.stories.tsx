import React from "react";
import styled from "styled-components";
import { grid, color, space } from "styled-system";
import Grid from "./index";
import Text from "@ui/components/Text";
// Just a stylable div used as a base grid element for the purpose of this story.
const Cell = styled.div<any>`
  // Make the div semi-opaque to show grid composition.
  opacity: 0.7;
  ${color}
  ${space}
  ${grid}
`;
export default {
  title: "Layout/Grid",
  component: Grid,
  argTypes: {
    columns: {
      type: "number",
      description:
        "The number of columns set with a `repeat(N, minmax(0, 1fr))` pattern or `none` to disable.",
      table: {
        category: "Container",
        defaultValue: {
          summary: 12,
        },
      },
    },
    rows: {
      type: "number",
      description:
        "The number of rows set with a `repeat(N, minmax(0, 1fr))` pattern or `none` to disable.",
      table: {
        category: "Container",
        defaultValue: {
          summary: "initial",
        },
      },
    },
    gridTemplateColumns: {
      type: "string",
      description:
        "The grid-template-columns CSS property defines the line names and track sizing functions of the grid columns.",
      table: {
        category: "Container",
      },
    },
    gridTemplateRows: {
      type: "string",
      description:
        "The grid-template-rows CSS property defines the line names and track sizing functions of the grid rows.",
      table: {
        category: "Container",
      },
    },
    gridTemplateAreas: {
      type: "string",
      description:
        "The grid-template-areas CSS property specifies named grid areas, establishing the cells in the grid and assigning them names.",
      table: {
        category: "Container",
      },
    },
    gridAutoColumns: {
      type: "string",
      description:
        "The grid-auto-columns CSS property specifies the size of an implicitly-created grid column track or pattern of tracks.",
      table: {
        category: "Container",
      },
    },
    gridAutoRows: {
      type: "string",
      description:
        "The grid-auto-rows CSS property specifies the size of an implicitly-created grid row track or pattern of tracks.",
      table: {
        category: "Container",
      },
    },
    gridAutoFlow: {
      type: "string",
      description:
        "The grid-auto-flow CSS property controls how the auto-placement algorithm works, specifying exactly how auto-placed items get flowed into the grid.",
      options: ["row", "column", "dense", "row dense", "column dense"],
      control: {
        type: "select",
      },
      table: {
        category: "Container",
      },
    },
    gridGap: {
      type: "number",
      description:
        "The gap CSS property sets the gaps (gutters) between rows and columns. It is a shorthand for row-gap and column-gap.",
      table: {
        category: "Container",
      },
    },
    gridRowGap: {
      type: "number",
      description:
        "The row-gap CSS property sets the size of the gap (gutter) between an element's grid rows.",
      table: {
        category: "Container",
      },
    },
    gridColumnGap: {
      type: "number",
      description:
        "The column-gap CSS property sets the size of the gap (gutter) between an element's columns.",
      table: {
        category: "Container",
      },
    },
    gridColumn: {
      type: "string",
      description:
        "The grid-column CSS shorthand property specifies a grid item's size and location within a grid column by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the inline-start and inline-end edge of its grid area.",
      table: {
        category: "Cell",
      },
    },
    gridRow: {
      type: "string",
      description:
        "The grid-row CSS shorthand property specifies a grid item’s size and location within the grid row by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the inline-start and inline-end edge of its grid area.",
      table: {
        category: "Cell",
      },
    },
    gridArea: {
      type: "string",
      description:
        "The grid-area CSS shorthand property specifies a grid item’s size and location within a grid by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the edges of its grid area.",
      table: {
        category: "Cell",
      },
    },
  },
};
const cells = Array.from(
  {
    length: 47,
  },
  (_, i) => {
    // Apply some span to showoff the grid system a bit.
    const colSpan = i % 7 === 0 ? 4 : i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 0;
    const rowSpan = i % 14 === 0 ? 2 : i % 6 === 0 ? 4 : 0;
    return (
      <Cell
        key={i}
        backgroundColor="aliceBlue"
        padding={1}
        opacity={1}
        gridColumn={colSpan > 0 ? `span ${colSpan}` : "initial"}
        gridRow={colSpan > 0 ? `span ${rowSpan}` : "initial"}
      >
        {i + 2}
        <div
          style={{
            fontSize: "10px",
          }}
        >
          {colSpan > 0 ? `(column span ${colSpan})` : ""}
        </div>
        <div
          style={{
            fontSize: "10px",
          }}
        >
          {rowSpan > 0 ? `(row span ${rowSpan})` : ""}
        </div>
      </Cell>
    );
  },
);

// eslint-disable-next-line
const DefaultTemplate = ({ gridColumn, gridRow, gridArea, ...args }: any) => {
  return (
    <>
      <Text
        style={{
          marginBottom: "1em",
        }}
      >
        A 12 columns grid using default props and containing cells with various span values.
      </Text>
      <Grid {...args}>
        <Cell
          key="-1"
          backgroundColor="aliceBlue"
          padding={1}
          opacity={1}
          gridColumn={gridColumn}
          gridRow={gridRow}
          gridArea={gridArea}
        >
          1
        </Cell>
        {cells}
      </Grid>
    </>
  );
};

export const Default = DefaultTemplate;
// @ts-expect-error FIXME
Default.args = {
  gridGap: 1,
};

// eslint-disable-next-line
const FixedTemplate = ({ gridColumn, gridRow, gridArea, ...args }: any) => (
  <>
    <Text
      style={{
        marginBottom: "1em",
      }}
    >
      This example with fixed cells is taken from the{" "}
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout"
        style={{
          cursor: "pointer",
        }}
      >
        MDN
      </a>{" "}
      documentation.
    </Text>
    <Grid {...args}>
      <>
        <Cell
          color="white"
          padding="2"
          gridColumn={gridColumn}
          gridRow={gridRow}
          gridArea={gridArea}
          backgroundColor="red"
        >
          Control me using {`"Cell"`} props.
        </Cell>
        <Cell gridColumn="2 / 4" gridRow="1 / 3" backgroundColor="blue" />
        <Cell gridColumn="1" gridRow="2 / 5" backgroundColor="green" />
        <Cell gridColumn="3" gridRow="3" backgroundColor="purple" />
        <Cell gridColumn="2" gridRow="4" backgroundColor="teal" />
        <Cell gridColumn="3" gridRow="4" backgroundColor="brown" />
      </>
    </Grid>
  </>
);

export const Fixed = FixedTemplate;
// @ts-expect-error FIXME
Fixed.args = {
  columns: 3,
  rows: undefined,
  gridAutoRows: "100px",
  gridGap: 1,
  gridTemplateColumns: undefined,
  gridTemplateRows: undefined,
  gridTemplateAreas: undefined,
  gridRowGap: undefined,
  gridColumnGap: undefined,
  gridColumn: "1/3",
  gridRow: "1",
  gridArea: undefined,
  gridAutoFlow: undefined,
  gridAutoColumns: undefined,
};
