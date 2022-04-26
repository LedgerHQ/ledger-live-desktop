import React, { useCallback, memo, useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router";
import styled from "styled-components";
import { Trans } from "react-i18next";
import {
  updateAllProgress,
  isOutOfMemoryState,
  predictOptimisticState,
  reducer,
} from "@ledgerhq/live-common/lib/apps";
import { App } from "@ledgerhq/live-common/lib/types/manager";
import { State, Action } from "@ledgerhq/live-common/lib/apps/types";
import { Flex, InfiniteLoader, Icons, Text, Tag, Tooltip } from "@ledgerhq/react-ui";

import { Loader, LoaderContainer, LOADER_SIZE } from "./Progress";
import CollapsibleCard from "~/renderer/components/CollapsibleCard";
import FadeInOutBox from "~/renderer/components/FadeInOutBox";
import Button from "~/renderer/components/Button";

import Item from "./Item";

const UpdatableHeader = styled(Flex).attrs(() => ({
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
}))``;

type Props = {
  update: App[];
  state: State;
  optimisticState: State;
  dispatch: (arg: Action) => void;
  isIncomplete: boolean;
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

  const updateHeader = visible && (
    <UpdatableHeader>
      {updateAllQueue.length > 0 ? (
        <>
          <Flex flex={1} flexDirection="column">
            <Text variant="h5" color="neutral.c100">
              <Trans
                i18nKey="manager.applist.updatable.progressTitle"
                values={{ number: updateAllQueue.length }}
                count={updateAllQueue.length}
              />
            </Text>
          </Flex>
          <Flex flexDirection="row" alignItems="center" alignSelf="center">
            <Text variant="paragraph" fontWeight="semibold" color="primary.c80" mr={2}>
              <Trans i18nKey="manager.applist.updatable.progress" />
            </Text>
            <LoaderContainer>
              {updateProgress !== 1 ? (
                <Loader progress={(updateProgress || 0) * 100} />
              ) : (
                <InfiniteLoader size={LOADER_SIZE} />
              )}
            </LoaderContainer>
          </Flex>
        </>
      ) : (
        <>
          <Flex>
            <Text variant="h5" color="neutral.c100">
              <Trans i18nKey="manager.applist.updatable.title" count={update.length} />
            </Text>
            <Tag ml={5} type="plain" size="medium" active>
              {update.length}
            </Tag>
          </Flex>
          <Tooltip
            disabled={!outOfMemory}
            content={
              outOfMemory ? <Trans i18nKey="manager.applist.item.updateAllOutOfMemory" /> : null
            }
          >
            <Button
              id={"managerAppsList-updateAll"}
              variant="main"
              disabled={outOfMemory}
              onClick={onUpdateAll}
              event="Manager Update All"
              Icon={Icons.RefreshMedium}
              iconPosition="left"
            >
              <Trans i18nKey="manager.applist.item.updateAll" />
            </Button>
          </Tooltip>
        </>
      )}
    </UpdatableHeader>
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
    <FadeInOutBox in={visible}>
      <CollapsibleCard mt={10} mb={7} header={updateHeader} open={open} onOpen={setIsOpen}>
        <Flex rowGap={8} mt={10} flexDirection="column">
          {update.map(mapApp)}
        </Flex>
      </CollapsibleCard>
    </FadeInOutBox>
  );
};

export default memo<Props>(UpdateAllApps);
