import React from "react";
import { connect } from "react-redux";
import { Popin } from "@ledgerhq/react-ui";

import { closeModal } from "~/renderer/actions/modals";
import { isModalOpened as isModalOpenedSelector, getModalData } from "~/renderer/reducers/modals";
import Snow, { isSnowTime } from "~/renderer/extra/Snow";
import ModalBody from "./ModalBody";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import ModalContent from "./ModalContent";

const mapStateToProps = (state: any, { name, isOpened, onBeforeOpen }: Props): any => {
  const data = getModalData(state, name || "");
  const modalOpened = isOpened || (name && isModalOpenedSelector(state, name));

  if (onBeforeOpen && modalOpened) {
    onBeforeOpen({ data });
  }
  return {
    isOpened: !!modalOpened,
    data,
  };
};

const mapDispatchToProps = (dispatch: () => {}, { name, onClose = () => {} }: Props): any => {
  return {
    onClose: name
      ? () => {
          dispatch(closeModal(name));
          onClose();
        }
      : onClose,
  };
};

export type RenderProps = {
  onClose?: () => void;
  data: any;
};

type Props = {
  isOpened?: boolean;
  children?: any;
  centered?: boolean;
  onClose?: () => void;
  onHide?: () => void;
  render?: (props: RenderProps) => React.ReactNode;
  data?: any;
  preventBackdropClick?: boolean;
  width?: number;
  theme?: any;
  name?: string;
  onBeforeOpen?: ({ data }: { data: Pick<RenderProps, "data"> }) => {};
  backdropColor?: boolean;
};

/**
 * This component is just a proxy to the Popin component defined in @ledgerhq/react-ui.
 * It should only be used to map leagacy props/logic from LLD to the new popin component.
 *
 * @deprecated Please, prefer using the Popin component from our design-system if possible.
 */
const Modal = ({ isOpened, children, onClose, render, data, width }: Props) => (
  <Popin isOpen={!!isOpened} width={width}>
    {isSnowTime() ? <Snow numFlakes={100} /> : null}
    <Popin.Body>
      {render && render({ onClose, data })}
      {children}
    </Popin.Body>
  </Popin>
);

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
export { ModalBody, ModalHeader, ModalFooter, ModalContent };
