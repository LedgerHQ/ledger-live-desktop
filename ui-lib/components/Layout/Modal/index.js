// @flow
import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import type { ThemedComponent } from "@ui/styles/StyleProvider";
import Button from "@ui/components/Button";
import Cross from "@ui/icons/Cross";
import TransitionInOut from "@ui/components/Transition/TransitionInOut";
import TransitionScale from "@ui/components/Transition/TransitionScale";

type ModalProps = {
  isOpen: boolean,
  children: React$Node,
  onClose?: () => void,
  width?: number,
  height?: number,
};

const Container: ThemedComponent<*> = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: ${p => p.theme.colors.palette.v2.background.default};
  padding: ${p => p.theme.space[3]}px;
`;

const Wrapper: ThemedComponent<{ width?: number, height?: number }> = styled.div`
  height: ${p => p.height || p.theme.sizes.modal.min.height}px;
  width: ${p => p.width || p.theme.sizes.modal.min.width}px;
  min-height: ${p => p.theme.sizes.modal.min.height}px;
  min-width: ${p => p.theme.sizes.modal.min.width}px;
  max-height: ${p => p.theme.sizes.modal.max.height}px;
  max-width: ${p => p.theme.sizes.modal.max.width}px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  z-index: ${p => p.theme.zIndexes[8]};
`;

const Overlay: ThemedComponent<*> = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  background-color: ${p => p.theme.colors.palette.v2.background.overlay};
`;

const CloseButton: ThemedComponent<*> = styled(Button)`
  position: absolute;
  top: ${p => p.theme.space[3]}px;
  right: ${p => p.theme.space[3]}px;
`;

const Modal = ({ isOpen, children, width, height, onClose }: ModalProps) => (
  <TransitionInOut in={isOpen} appear mountOnEnter unmountOnExit>
    <Overlay>
      <TransitionScale in={isOpen} appear>
        <Wrapper width={width} height={height}>
          <Container>
            <CloseButton Icon={Cross} onClick={onClose} />
            {children}
          </Container>
        </Wrapper>
      </TransitionScale>
    </Overlay>
  </TransitionInOut>
);

const ModalWrapper = ({ children, ...modalProps }: ModalProps) => {
  const $root = React.useMemo(() => document.querySelector("#ll-modal-root"), []);

  if ($root === null) throw new Error("modal root cannot be found");

  return ReactDOM.createPortal(<Modal {...modalProps}>{children}</Modal>, $root);
};

export default ModalWrapper;
