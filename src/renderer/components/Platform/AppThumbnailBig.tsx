import React, { useCallback, useState } from "react";
import { AppManifest } from "@ledgerhq/live-common/lib/platform/types";
import { Flex } from "@ledgerhq/react-ui";
import styled from "styled-components";
import LiveAppIcon from "../WebPlatformPlayer/LiveAppIcon";
import AppName from "./AppName";
import { containerButtonCSS } from "./styles";
import LoadingPlaceholder from "../LoadingPlaceholder";

const Container = styled(Flex).attrs({
  position: "relative",
  flexDirection: "row",
  height: "118px",
  alignItems: "center",
  borderRadius: "8px",
  backgroundColor: "neutral.c30",
  justifyContent: "center",
  alignSelf: "center",
  overflow: "hidden",
})`
  ${containerButtonCSS};
`;

const Image = styled.img<{ loaded: boolean }>`
  object-fit: cover;
  height: 100%;
  width: 100%;
  opacity: ${(p: { loaded: boolean }) => (p.loaded ? 1 : 0)};
`;

type Props = {
  manifest: AppManifest;
  onClick: (manifest: AppManifest) => void;
  thumbnailUrl: string;
};

const AppThumbnailBig = ({ manifest, thumbnailUrl, onClick }: Props) => {
  const { name, icon } = manifest;
  const [loaded, setLoaded] = useState(false);
  const handleClick = useCallback(() => {
    onClick(manifest);
  }, [manifest, onClick]);
  return (
    <Container onClick={handleClick}>
      {thumbnailUrl && <Image src={thumbnailUrl} loaded={loaded} onLoad={() => setLoaded(true)} />}
      {!loaded && (
        <Flex position="absolute" top={0} bottom={0} right={0} left={0} justifyContent="center">
          {thumbnailUrl ? (
            <LoadingPlaceholder />
          ) : (
            <Flex flexDirection="row" columnGap="12px" justifyContent="center" alignItems="center">
              <LiveAppIcon size={32} icon={icon || undefined} name={name} />
              <AppName>{name}</AppName>
            </Flex>
          )}
        </Flex>
      )}
    </Container>
  );
};

export default AppThumbnailBig;
