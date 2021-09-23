import styled, { keyframes } from "styled-components";
// @ts-expect-error FIXME
import InfiniteLoaderImage from "@ui/assets/images/infiniteLoader.png";

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const InfiniteLoader = styled.img.attrs({
  alt: "loading...",
  src: InfiniteLoaderImage,
  width: "28",
  height: "28",
})`
  animation: ${rotate} 1s linear infinite;
  transition: 100ms linear transform;
`;

export default InfiniteLoader;
