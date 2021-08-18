import React, { useCallback } from "react";
import styled from "styled-components";
import Text from "@ui/components/Text";
import Flex from "@ui/components/Layout/Flex";

const Wrapper = styled(Flex)<{ image?: string }>`
  width: 100%;
  height: 100%;
  background: gray;
  flex-direction: column;
  padding: 32px 24px;
  padding-right: 280px;
  z-index: ${(p) => p.theme.zIndexes[8]};
  background: url(${(p) => p.image}) no-repeat ${(p) => p.theme.colors.palette.v2.text.default};
  background-size: contain;
  background-position: right 60px bottom;
  color: ${(p) => p.theme.colors.palette.v2.background.default};
`;

type Props = {
  url?: string;
  path?: string;
  title: string;
  description: string;
  image: any;
};

const Slide = ({ title, description, image, url, path }: Props): React.ReactElement => {
  const onClick = useCallback(() => {
    // Nb navigate to either an internal path or an external url
    // TODO implement the logic fork here
    alert("Should navigate at this point");
  }, []);

  return (
    <Wrapper key={"key"} image={image} onClick={onClick}>
      <Text color="background.default" ff="Inter|Regular" fontSize={10}>
        {title}
      </Text>
      <Text color="background.default" ff="Alpha|Medium" textTransform="uppercase" fontSize={20}>
        {description}
      </Text>
    </Wrapper>
  );
};

export default Slide;
