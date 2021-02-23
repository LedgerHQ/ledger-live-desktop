// @flow

import React, { useContext, useCallback, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import noop from "lodash/noop";

import { Transition } from "react-transition-group";

import { closeModal } from "~/renderer/actions/modals";
import { isModalOpened, getModalData } from "~/renderer/reducers/modals";
import Snow, { isSnowTime } from "~/renderer/extra/Snow";
import ProductTourContext from "~/renderer/components/ProductTour/ProductTourContext";

export { default as ModalBody } from "./ModalBody";

const domNode = document.getElementById("modals");

const mapStateToProps = (state, { name, isOpened, onBeforeOpen }: Props): * => {
  const data = getModalData(state, name || "");
  const modalOpened = isOpened || (name && isModalOpened(state, name));

  if (onBeforeOpen && modalOpened) {
    onBeforeOpen({ data });
  }

  return {
    isOpened: !!modalOpened,
    data,
  };
};

const mapDispatchToProps = (dispatch: *, { name, onClose = noop }: Props): * => ({
  onClose: name
    ? () => {
        dispatch(closeModal(name));
        onClose();
      }
    : onClose,
});

const transitionsOpacity = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

const transitionsScale = {
  // FIXME, we just lost the scale animation for product tour
  entering: { transform: "scale(1)" },
  entered: { transform: "scale(1)" },
  exiting: { transform: "scale(1)" },
  exited: { transform: "scale(1)" },
};

const Container = styled.div.attrs(({ state, centered, isOpened }) => ({
  style: {
    ...transitionsOpacity[state],
    justifyContent: centered ? "center" : "flex-start",
    pointerEvents: isOpened ? "auto" : "none",
  },
}))`
  background-color: ${p => (p.backdropColor ? "rgba(0, 0, 0, 0.4)" : "rgba(0,0,0,0)")};
  opacity: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  padding: 60px 0 60px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: opacity 200ms cubic-bezier(0.3, 1, 0.5, 0.8);
`;

const BodyWrapper = styled.div.attrs(({ state, centered, isOpened }) => ({
  style: {
    ...transitionsOpacity[state],
    ...transitionsScale[state],
  },
}))`
  background: ${p => p.theme.colors.palette.background.paper};
  color: ${p => p.theme.colors.palette.text.shade80};
  width: ${p => p.width || 500}px;
  border-radius: 3px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.2);
  flex-shrink: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  transform: scale(1.1);
  opacity: 0;
  transition: all 200ms cubic-bezier(0.3, 1, 0.5, 0.8);
`;

export type RenderProps = {
  onClose?: void => void,
  data: any,
};

type Props = {
  isOpened?: boolean,
  children?: any,
  centered?: boolean,
  onClose?: void => void,
  onHide?: void => void,
  render?: RenderProps => any,
  data?: any,
  preventBackdropClick?: boolean,
  showProductTourBack?: boolean,
  width?: number,
  theme: any,
  name?: string, // eslint-disable-line
  onBeforeOpen?: ({ data: * }) => *, // eslint-disable-line
  backdropColor: ?boolean,
  style?: *,
};

const Modal = ({
  isOpened,
  children,
  centered,
  onClose,
  onHide,
  render,
  data,
  preventBackdropClick: _preventBackdropClick,
  showProductTourBack,
  width,
  theme,
  name,
  onBeforeOpen,
  backdropColor,
  style,
}: Props) => {
  const [directlyClickedBackdrop, setDirectlyClickedBackdrop] = useState(false);
  const { state, send } = useContext(ProductTourContext);
  const { context } = state;
  const shouldBlockModal = state.matches("flow.ongoing") && context.controlledModals.includes(name);
  const preventBackdropClick = _preventBackdropClick || shouldBlockModal;

  useEffect(() => {
    if (isOpened && shouldBlockModal) {
      send("CONTROL_MODAL");
    }
  }, [isOpened, send, shouldBlockModal]);

  const handleKeyup = useCallback(
    (e: KeyboardEvent) => {
      if (e.which === 27 && onClose && !preventBackdropClick) {
        onClose();
      }
    },
    [onClose, preventBackdropClick],
  );

  const preventFocusEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Tab") {
      const { target } = e;
      const focusableQuery =
        "input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), *[tabindex]";
      const modalWrapper = document.getElementById("modals");
      if (!modalWrapper || !(target instanceof window.HTMLElement)) return;

      const focusableElements = modalWrapper.querySelectorAll(focusableQuery);
      if (!focusableElements.length) return;

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && firstFocusable.isSameNode(target)) {
        lastFocusable.focus();
        e.stopPropagation();
        e.preventDefault();
      } else if (!e.shiftKey && lastFocusable.isSameNode(target)) {
        firstFocusable.focus();
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }, []);

  const handleClickOnBackdrop = useCallback(() => {
    if (directlyClickedBackdrop && !preventBackdropClick && onClose) {
      onClose();
    }
  }, [directlyClickedBackdrop, onClose, preventBackdropClick]);

  const onDirectMouseDown = useCallback(() => setDirectlyClickedBackdrop(true), []);
  const onIndirectMouseDown = useCallback(() => setDirectlyClickedBackdrop(false), []);

  /** combined with tab-index 0 this will allow tab navigation into the modal disabling tab navigation behind it */
  const setFocus = useCallback((r: *) => {
    /** only pull focus if focus is out of modal ie: no input autofocused in modal */
    r && !r.contains(document.activeElement) && r.focus();
  }, []);

  const swallowClick = useCallback((e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  useEffect(() => {
    document.addEventListener("keyup", handleKeyup);
    document.addEventListener("keydown", preventFocusEscape);
    return () => {
      document.removeEventListener("keyup", handleKeyup);
      document.removeEventListener("keydown", preventFocusEscape);
    };
  }, [handleKeyup, preventFocusEscape]);

  useEffect(() => {
    if (!isOpened && onHide) onHide();
  }, [isOpened, onHide]);

  const renderProps = {
    onClose,
    data,
  };

  const modal = (
    <Transition
      in={isOpened}
      appear
      mountOnEnter
      unmountOnExit
      timeout={{
        appear: 100,
        enter: 100,
        exit: 200,
      }}
    >
      {state => {
        return (
          <Container
            id="modal-backdrop"
            state={state}
            centered={centered}
            isOpened={isOpened}
            onMouseDown={onDirectMouseDown}
            onClick={handleClickOnBackdrop}
            backdropColor={backdropColor}
          >
            {isSnowTime() ? <Snow numFlakes={100} /> : null}
            <BodyWrapper
              tabIndex="0"
              ref={setFocus}
              state={state}
              width={width}
              onClick={swallowClick}
              onMouseDown={e => {
                onIndirectMouseDown();
                e.stopPropagation();
              }}
              id="modal-container"
              style={style}
            >
              {render && render(renderProps)}
              {children}
            </BodyWrapper>
          </Container>
        );
      }}
    </Transition>
  );

  return domNode ? createPortal(modal, domNode) : null;
};

// $FlowFixMe: define a OwnProps
export default connect(mapStateToProps, mapDispatchToProps)(Modal);
