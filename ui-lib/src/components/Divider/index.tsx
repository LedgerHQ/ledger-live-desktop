import styled from "styled-components";

type DividerTypes = "light" | "dark";

interface Props {
  margin?: number;
  type?: DividerTypes; // Nb default to light grey
}
const Divider = styled.div<Props>`
  display: block;
  margin: ${p => (p.margin === undefined ? 20 : p.margin)}px 0;
  background: ${p =>
    p.type === "dark"
      ? p.theme.colors.palette.v2.grey.borderDark
      : p.theme.colors.palette.v2.grey.border};
  height: 1px;
`;

export default Divider;
