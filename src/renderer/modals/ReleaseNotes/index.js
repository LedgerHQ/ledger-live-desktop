// @flow

import React from "react";
import Modal from "~/renderer/components/Modal";
import ReleaseNotesBody from "./ReleaseNotesBody";

const ReleaseNotesModal = () => (
  <Modal
    name="MODAL_RELEASE_NOTES"
    centered
    render={({ data, onClose }) => <ReleaseNotesBody version={data} onClose={onClose} />}
  />
);

export default ReleaseNotesModal;
