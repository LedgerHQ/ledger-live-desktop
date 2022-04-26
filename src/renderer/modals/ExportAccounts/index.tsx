import React from "react";
import { Trans, useTranslation } from "react-i18next";

import Modal, { ModalBody } from "~/renderer/components/Modal";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Exporter from "~/renderer/components/Exporter";
import { Flex } from "@ledgerhq/react-ui";

const ExportAccountsModal = () => {
  const { t } = useTranslation();

  return (
    <Modal
      name="MODAL_EXPORT_ACCOUNTS"
      render={({ onClose, data }) => {
        return (
          <ModalBody
            onClose={onClose}
            title={t("settings.export.modal.title")}
            render={() => (
              <Flex my={8} justifyContent="center">
                <Exporter {...data} />
              </Flex>
            )}
            renderFooter={() => (
              <Flex flexGrow={1} justifyContent="flex-end">
                <Button variant="main" onClick={onClose}>
                  <Trans i18nKey="settings.export.modal.button" />
                </Button>
              </Flex>
            )}
          />
        );
      }}
    />
  );
};

export default ExportAccountsModal;
