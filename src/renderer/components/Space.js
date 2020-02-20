import styled from "styled-components";

export default styled.div`
  height: ${p => `${p.of}px` || "auto"};
  flex-grow: ${p => (p.grow ? 1 : 0)};
`;
