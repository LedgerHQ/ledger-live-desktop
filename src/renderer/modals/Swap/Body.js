// @flow
import React from "react";
import { Trans } from "react-i18next";
import Button from "~/renderer/components/Button";
import { ModalBody } from "~/renderer/components/Modal";

const Body = ({ exchange, onClose }: { exchange: Exchange, onClose: any }) => {
  return (
    <ModalBody
      onClose={onClose}
      title={<Trans i18nKey="swap.modal.title" />}
      render={() => <div>{JSON.stringify(exchange)}</div>}
      renderFooter={() => (
        <>
          <Button onClick={onClose} primary data-e2e="modal_buttonClose_swap">
            <Trans i18nKey="common.close" />
          </Button>
        </>
      )}
    />
  );
};

export default Body;
