// @flow

import React, { useEffect, useCallback, useState, useRef } from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import IconCross from "~/renderer/icons/Cross";
import { createFocusTrap } from "focus-trap";

const TouchButton = styled.div`
  display: inline-flex;
  max-height: 100%;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  color: ${p => p.theme.colors.palette.text.shade80};
  transition: filter 150ms ease-out;
  cursor: pointer;

  :hover {
    filter: opacity(0.8);
  }
  :active {
    filter: opacity(0.5);
  }
`;

const DURATION = 150;

const ModalBackdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: black;
  will-change: opacity;
  opacity: 0;
`;

const ModalTopContainer = styled.div`
  position: absolute;
  top: 43px;
  right: 43px;
  z-index: 1;
`;

const ModalContent = styled.div`
  z-index: 1;
  will-change: transform;
  opacity: 0;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  overflow: hidden;
`;

const ModalContainer = styled.div`
  color: ${p => p.theme.colors.palette.text.shade90};
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  visibility: hidden;
  pointer-events: none;

  &.modal-enter {
    visibility: visible;
    pointer-events: all;
  }

  &.modal-enter-active {
    visibility: visible;
    pointer-events: all;
  }

  &.modal-enter-done {
    visibility: visible;
    pointer-events: all;
  }

  &.modal-exit {
    visibility: visible;
    pointer-events: all;
  }

  &.modal-exit-active {
    visibility: visible;
    pointer-events: all;
  }

  &.modal-exit-done {
    visibility: hidden;
    pointer-events: none;
  }

  &.modal-enter-done {
    visibility: visible;
    pointer-events: all;
  }

  &.modal-enter ${ModalBackdrop} {
    opacity: 0;
  }

  &.modal-enter-active ${ModalBackdrop} {
    opacity: 0.65;
    transition: opacity ${DURATION}ms ease-out;
  }

  &.modal-enter-done ${ModalBackdrop} {
    opacity: 0.65;
  }

  &.modal-exit ${ModalBackdrop} {
    opacity: 0.65;
  }

  &.modal-exit-active ${ModalBackdrop} {
    opacity: 0;
    transition: opacity ${DURATION}ms ease-out;
  }

  &.modal-exit-done ${ModalBackdrop} {
    opacity: 0;
  }

  &.modal-enter ${ModalContent} {
    opacity: 0;
    transform: scale(0.95);
  }

  &.modal-enter-active ${ModalContent} {
    opacity: 1;
    transform: scale(1);
    transition: all ${DURATION}ms ease-out;
  }

  &.modal-enter-done ${ModalContent} {
    opacity: 1;
    transform: scale(1);
  }

  &.modal-exit ${ModalContent} {
    opacity: 1;
    transform: scale(1);
  }

  &.modal-exit-active ${ModalContent} {
    opacity: 0;
    transition: all ${DURATION}ms ease-out;
    transform: scale(0.95);
  }

  &.modal-exit-done ${ModalContent} {
    opacity: 0;
    transform: scale(0.95);
  }
`;

type ModalProps = {
  children?: React$Node,
  isOpen?: boolean,
  onRequestClose?: (*) => void,
};

export function Modal({ children, isOpen = false, onRequestClose }: ModalProps) {
  const [isMounted, setMounted] = useState(false);

  const onKeyPress = useCallback(
    e => {
      if (isOpen && e.key === "Escape" && onRequestClose) {
        e.preventDefault();
        onRequestClose(e);
      }
    },
    [onRequestClose, isOpen],
  );

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onKeyPress, false);
    return () => {
      window.removeEventListener("keydown", onKeyPress, false);
    };
  }, [onKeyPress]);

  const focusTrapElem = useRef(null);
  const focusTrap = useRef(null);

  useEffect(() => {
    if (!isMounted) return;

    focusTrap.current = createFocusTrap(focusTrapElem.current, {
      fallbackFocus: focusTrapElem.current,
      escapeDeactivates: false,
      clickOutsideDeactivates: false,
      preventScroll: true,
    });

    return () => {
      focusTrap.current = null;
    };
  }, [isMounted]);

  const onEntered = useCallback(() => {
    if (!focusTrap.current) return;

    focusTrap.current.activate();
  }, []);

  const onExited = useCallback(() => {
    if (!focusTrap.current) return;

    focusTrap.current.deactivate();
  }, []);

  if (!isMounted) {
    return null;
  }

  return ReactDOM.createPortal(
    <CSSTransition
      in={isOpen}
      timeout={DURATION}
      onEntered={onEntered}
      onExited={onExited}
      classNames="modal"
    >
      <ModalContainer ref={focusTrapElem} tabIndex="-1">
        <ModalContent isOpened={isOpen}>
          {onRequestClose ? (
            <ModalTopContainer>
              <TouchButton onClick={onRequestClose}>
                <IconCross size={24} />
              </TouchButton>
            </ModalTopContainer>
          ) : null}
          {children}
        </ModalContent>
        <ModalBackdrop onClick={onRequestClose || undefined} />
      </ModalContainer>
    </CSSTransition>,
    // $FlowFixMe
    document.getElementById("modals"),
  );
}
