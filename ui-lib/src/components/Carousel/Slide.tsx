import React from "react";
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
  background: url(${(p) => p.image}) no-repeat ${(p) => p.theme.colors.palette.neutral.c100};
  background-size: contain;
  background-position: right 60px bottom;
`;

type Props = {
  onClick: () => void;
  title: string;
  description: string;
  image: any;
};

const Slide = ({ title, description, image, onClick }: Props): React.ReactElement => {
  return (
    <Wrapper key={"key"} image={image} onClick={onClick}>
      <Text color="palette.neutral.c00" ff="Inter|Regular" fontSize={10}>
        {title}
      </Text>
      <Text color="palette.neutral.c00" ff="Alpha|Medium" textTransform="uppercase" fontSize={20}>
        {description}
      </Text>
    </Wrapper>
  );
};

export default Slide;
