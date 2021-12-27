import React from "react";
import styled from "styled-components";
import { Text, Flex, Button, Icons } from "@ledgerhq/react-ui";
import AppCard from "~/renderer/components/Platform/AppCard";
import SectionHeader from "~/renderer/components/Platform/SectionHeader";
import AppRow from "~/renderer/components/Platform/AppRow";
import { SectionBaseProps } from "./types";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;
  width: 100%;
  justify-content: stretch;
  margin-bottom: auto;
`;

const GridItem = styled.div`
  > * {
    height: 100%;
  }
`;

type Props = SectionBaseProps;

const SectionLiveApps: React.FC<SectionBaseProps> = ({ manifests, handleClick }: Props) => {
  return (
    <>
      <SectionHeader title="live apps" />
      <Flex flexDirection="column" rowGap="12px">
        {manifests.map(manifest => (
          <AppRow
            key={manifest.id}
            id={`platform-catalog-app-${manifest.id}`}
            manifest={manifest}
            onClick={() => handleClick(manifest)}
          />
        ))}
      </Flex>
      <Grid length={manifests.length}>
        {manifests.map(manifest => (
          <GridItem key={manifest.id}>
            <AppCard
              id={`platform-catalog-app-${manifest.id}`}
              manifest={manifest}
              onClick={() => handleClick(manifest)}
            />
          </GridItem>
        ))}
      </Grid>
    </>
  );
};

export default SectionLiveApps;
