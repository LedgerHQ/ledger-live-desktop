// @flow
import React from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";

import type { State } from "@ledgerhq/live-common/lib/apps/types";

import { useAppInstallProgress } from "@ledgerhq/live-common/lib/apps/react";

import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import ProgressBar from "~/renderer/components/Progress";

const Holder = styled.div`
  width: 100px;
  height: 5px;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
`;

type Props = {
  state: State,
  name: string,
  updating?: boolean,
  installing?: boolean,
  uninstalling?: boolean,
  isCurrent: boolean,
};

// we can forward appOp from state.currentAppOp if it matches the contextual app
const Progress = ({ state, name, updating, installing, uninstalling, isCurrent }: Props) => {
  const progress = useAppInstallProgress(state, name);

  return (
    <Box flex="1" horizontal justifyContent="flex-end" overflow="hidden">
      <Box flex="0 0 auto" vertical alignItems="flex-end" justifyContent="center">
        <Box
          flex="0 0 auto"
          horizontal
          alignItems="center"
          justifyContent="center"
          py={1}
          maxWidth="100%"
          data-test-id={`manager-${name}-app-progress-bar`}
        >
          <Text ff="Inter|SemiBold" fontSize={3} color="palette.primary.main">
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
        </Box>
        <Holder>
          {uninstalling ? (
            <ProgressBar infinite timing={1200} />
          ) : installing && isCurrent && progress !== 1 ? (
            <ProgressBar infinite timing={1200} progress={progress || 0} />
          ) : (
            <ProgressBar color="palette.text.shade20" progress={-1} />
          )}
        </Holder>
      </Box>
    </Box>
  );
};

export default Progress;
