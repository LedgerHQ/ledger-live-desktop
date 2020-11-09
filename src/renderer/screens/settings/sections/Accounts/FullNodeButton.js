// @flow
import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import { openModal } from "~/renderer/actions/modals";
import { useDispatch } from "react-redux";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import Track from "~/renderer/analytics/Track";
import Button from "~/renderer/components/Button";

const FullNodeButton = () => {
  const fullNodeEnabled = getEnv("SATSTACK");
  const dispatch = useDispatch();
  const onOpenModal = useCallback(() => dispatch(openModal("MODAL_FULL_NODE")), [dispatch]);

  return (
    <>
      <Track onUpdate event={fullNodeEnabled ? "editFullNode" : "setupFullNode"} />
      <Button onClick={onOpenModal} primary>
        <Trans i18nKey={fullNodeEnabled ? "fullNode.edit" : "fullNode.connect"} />
      </Button>
    </>
  );
};

export default FullNodeButton;
