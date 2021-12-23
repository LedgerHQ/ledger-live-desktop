// @flow
import React, { useCallback, memo, useState, useMemo, useEffect } from "react";

import styled from "styled-components";

import { Trans } from "react-i18next";

import {
  updateAllProgress,
  isOutOfMemoryState,
  predictOptimisticState,
  reducer,
} from "@ledgerhq/live-common/lib/apps";

import type { App } from "@ledgerhq/live-common/lib/types/manager";
import type { State, Action } from "@ledgerhq/live-common/lib/apps/types";

import CollapsibleCard from "~/renderer/components/CollapsibleCard";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box/Box";
import FadeInOutBox from "~/renderer/components/FadeInOutBox";
import Button from "~/renderer/components/Button";

import IconLoader from "~/renderer/icons/Loader";

import Item from "./Item";
import Progress from "~/renderer/components/Progress";

import ToolTip from "~/renderer/components/Tooltip";
import { useLocation } from "react-router";

const UpdatableHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 20px 10px 0px;
  height: 48px;
  box-sizing: content-box;
`;

const Badge = styled(Text)`
  border-radius: 29px;
  background-color: ${p => p.theme.colors.palette.primary.main};
  color: ${p => p.color || p.theme.colors.palette.background.paper};
  height: 18px;
  display: flex;
  align-items: center;
  padding: 0px 8px;
  margin-left: 10px;
`;

const ProgressHolder = styled.div`
  width: 100px;
  height: 5px;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
`;

type Props = {
  update: App[],
  state: State,
  optimisticState: State,
  dispatch: Action => void,
  isIncomplete: boolean,
};

const UpdateAllApps = ({ update, state, optimisticState, dispatch, isIncomplete }: Props) => {
  const { search } = useLocation();
  const [open, setIsOpen] = useState();
  const { updateAllQueue } = state;

  useEffect(() => {
    const params = new URLSearchParams(search || "");
    const y = params.get("updateApp");
    setIsOpen(y === "true");
  }, [search]);

  const outOfMemory = useMemo(
    () =>
      isOutOfMemoryState(predictOptimisticState(reducer(optimisticState, { type: "updateAll" }))),
    [optimisticState],
  );

  const visible = update.length > 0;

  const updateProgress = updateAllProgress(state);

  const onUpdateAll = useCallback(
    e => {
      if (open) e.stopPropagation();
      dispatch({ type: "updateAll" });
    },
    [dispatch, open],
  );

  const updateHeader =
    updateAllQueue.length > 0 ? (
      <>
        <Box vertical data-test-id="manager-update-all-progress-bar">
          <Text ff="Inter|SemiBold" fontSize={5} color="palette.primary.main">
            <Trans
              i18nKey="manager.applist.updatable.progressTitle"
              values={{ number: updateAllQueue.length }}
              count={updateAllQueue.length}
            />
          </Text>
          <Text ff="Inter|SemiBold" fontSize={2} color="palette.text.shade60">
            <Trans i18nKey="manager.applist.updatable.progressWarning" />
          </Text>
        </Box>
        <Box flex={1} />
        <Box vertical alignItems="flex-end">
          <Box
            flex="0 0 auto"
            horizontal
            alignItems="center"
            justifyContent="center"
            py={1}
            maxWidth="100%"
          >
            <Text ff="Inter|SemiBold" fontSize={3} color="palette.primary.main">
              <Trans i18nKey="manager.applist.updatable.progress" />
            </Text>
          </Box>
          <ProgressHolder>
            <Progress progress={updateProgress} timing={1200} infinite />
          </ProgressHolder>
        </Box>
      </>
    ) : (
      <>
        <Text ff="Inter|SemiBold" fontSize={4} color="palette.primary.main">
          <Trans i18nKey="manager.applist.updatable.title" count={update.length} />
        </Text>
        <Badge ff="Inter|Bold" fontSize={3} color="white">
          {update.length}
        </Badge>
        <Box flex={1} />
        <ToolTip
          content={
            outOfMemory ? <Trans i18nKey="manager.applist.item.updateAllOutOfMemory" /> : null
          }
        >
          <Button
            data-test-id="manager-update-all-apps-button"
            primary
            disabled={outOfMemory}
            onClick={onUpdateAll}
            fontSize={3}
            event="Manager Update All"
            eventProperties={{
              appName: update.map(app => app.name),
            }}
          >
            <Box horizontal alignItems="center" justifyContent="center">
              <IconLoader size={14} />
              <Text style={{ marginLeft: 8 }}>
                <Trans i18nKey="manager.applist.item.updateAll" />
              </Text>
            </Box>
          </Button>
        </ToolTip>
      </>
    );

  const mapApp = useCallback(
    (app, i) => (
      <Item
        optimisticState={optimisticState}
        state={state}
        installed={state.installed.find(({ name }) => name === app.name)}
        key={`UPDATE_${app.name}_${i}`}
        app={app}
        dispatch={dispatch}
        forceUninstall={isIncomplete}
        appStoreView={false}
        onlyUpdate={true}
        showActions={false}
      />
    ),
    [optimisticState, state, dispatch, isIncomplete],
  );

  return (
    <FadeInOutBox in={visible} mt={4}>
      <CollapsibleCard
        header={<UpdatableHeader>{visible && updateHeader}</UpdatableHeader>}
        open={open}
        onOpen={setIsOpen}
      >
        {update.map(mapApp)}
      </CollapsibleCard>
    </FadeInOutBox>
  );
};

export default memo<Props>(UpdateAllApps);
