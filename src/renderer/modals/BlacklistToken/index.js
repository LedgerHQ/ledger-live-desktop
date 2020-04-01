// @flow

import React from "react";
import Modal from "~/renderer/components/Modal";
import Body from "~/renderer/modals/BlacklistToken/Body";

const BlacklistTokenModal = () => (
  <Modal
    name="MODAL_BLACKLIST_TOKEN"
    centered
    render={({ data, onClose }) => <Body token={data.token} onClose={onClose} />}
  />
);

export default BlacklistTokenModal;
