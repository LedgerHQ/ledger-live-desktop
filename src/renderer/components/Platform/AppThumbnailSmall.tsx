import React, { useCallback } from "react";
import { AppManifest } from "@ledgerhq/live-common/lib/platform/types";
import { Flex } from "@ledgerhq/react-ui";
import styled from "styled-components";
import LiveAppIcon from "../WebPlatformPlayer/LiveAppIcon";
import AppName from "./AppName";
import { containerButtonCSS } from "./styles";

const Container = styled(Flex).attrs({
  flexDirection: "row",
  alignItems: "center",
  borderRadius: "8px",
  padding: "16px",
  columnGap: "12px",
  backgroundColor: "neutral.c30",
})`
  ${containerButtonCSS};
`;

type Props = {
  manifest: AppManifest;
  onClick: (manifest: AppManifest) => void;
};

const AppThumbnailSmall = ({ manifest, onClick }: Props) => {
  const { name, icon } = manifest;
  const handleClick = useCallback(() => {
    onClick(manifest);
  }, [manifest, onClick]);
  return (
    <Container onClick={handleClick}>
      <LiveAppIcon size={32} icon={icon || undefined} name={name} />
      <AppName>{name}</AppName>
    </Container>
  );
};

export default AppThumbnailSmall;
