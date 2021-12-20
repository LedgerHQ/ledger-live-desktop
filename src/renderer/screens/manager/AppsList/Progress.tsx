import React from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";

import { State } from "@ledgerhq/live-common/lib/apps/types";
import { Flex, InfiniteLoader, ProgressLoader, Text } from "@ledgerhq/react-ui";

import { useAppInstallProgress } from "@ledgerhq/live-common/lib/apps/react";

type Props = {
  state: State;
  name: string;
  updating?: boolean;
  installing?: boolean;
  uninstalling?: boolean;
  isCurrent: boolean;
};

export const LOADER_SIZE = 18;

export const Loader = styled(ProgressLoader).attrs(p => ({
  frontStrokeColor: p.theme.colors.primary.c80,
  radius: LOADER_SIZE / 2,
  stroke: 3.5,
  frontStrokeLinecap: "round",
  showPercentage: false,
}))``;

export const LoaderContainer = styled.div`
  height: ${LOADER_SIZE}px;
  width: ${LOADER_SIZE}px;
`;

// we can forward appOp from state.currentAppOp if it matches the contextual app
const Progress = ({ state, name, updating, installing, uninstalling, isCurrent }: Props) => {
  const progress = useAppInstallProgress(state, name);

  return (
    <Flex flex="1" flexDirection="row" justifyContent="flex-end" alignItems="center">
      <Text variant="paragraph" fontWeight="semibold" color="primary.c80" mr={2}>
        <Trans
          i18nKey={
            updating
              ? "manager.applist.item.updating"
              : uninstalling
              ? "manager.applist.item.uninstalling"
              : installing && isCurrent && progress !== 1
              ? "manager.applist.item.installing"
              : "manager.applist.item.scheduled"
          }
        />
      </Text>
      <LoaderContainer>
        {uninstalling ? (
          <InfiniteLoader size={LOADER_SIZE} />
        ) : installing && isCurrent && progress !== 1 ? (
          <Loader progress={(progress || 0) * 100} />
        ) : (
          <Loader progress={0} />
        )}
      </LoaderContainer>
    </Flex>
  );
};

export default Progress;
