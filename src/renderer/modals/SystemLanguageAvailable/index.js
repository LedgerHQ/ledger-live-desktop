// @flow

import React from "react";
import Modal from "~/renderer/components/Modal";
import SystemLanguageAvailableBody from "./SystemLanguageAvailableBody";

const SystemLanguageAvailableModal = () => (
  <Modal
    name="MODAL_SYSTEM_LANGUAGE_AVAILABLE"
    centered
    render={({ data, onClose }) => <SystemLanguageAvailableBody data={data} onClose={onClose} />}
  />
);

export default SystemLanguageAvailableModal;
