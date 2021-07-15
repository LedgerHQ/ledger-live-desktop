// @flow
import styled from "styled-components";
import { grid, StyledComponent } from "styled-system";

function getColumns(props) {
  const { columns } = props;
  return columns === "none" ? columns : `repeat(${columns || 12}, minmax(0, 1fr));`;
}

function getRows(props) {
  const { rows } = props;
  return !rows ? "initial" : rows === "none" ? rows : `repeat(${rows}, minmax(0, 1fr));`;
}

const Grid: StyledComponent<*> = styled.div`
  display: grid;
  grid-template-columns: ${getColumns};
  grid-template-rows: ${getRows};
  ${grid}
`;
export default Grid;
