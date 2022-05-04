import React from "react";

import Modal from "~/renderer/components/Modal";
import TermOfUseUpdateBody from "./TermOfUseUpdateBody";

const TermOfUseUpdateModal = () => (
  <Modal
    name="MODAL_TERM_OF_USE_UPDATE"
    centered
    preventBackdropClick={true}
    render={({ data, onClose }) => (
      <TermOfUseUpdateBody
        onClose={() => {
          data.acceptTerms();
          onClose();
        }}
      />
    )}
  />
);

export default TermOfUseUpdateModal;
