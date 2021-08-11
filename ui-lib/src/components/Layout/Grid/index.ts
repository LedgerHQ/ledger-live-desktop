import styled from "styled-components";
import { grid } from "styled-system";

interface GridProps {
  columns: string;
  rows: string;
}

function getColumns(props: GridProps) {
  const { columns } = props;
  return columns === "none" ? columns : `repeat(${columns || 12}, minmax(0, 1fr));`;
}

function getRows(props: GridProps) {
  const { rows } = props;
  return !rows ? "initial" : rows === "none" ? rows : `repeat(${rows}, minmax(0, 1fr));`;
}

const Grid = styled.div<GridProps>`
  display: grid;
  grid-template-columns: ${getColumns};
  grid-template-rows: ${getRows};
  ${grid}
`;
export default Grid;
