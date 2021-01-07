// @flow

import React, { useEffect, useCallback, useState, useRef } from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import { Transition } from "react-transition-group";
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

const DURATION = 250;

const DrawerBackdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: black;
  will-change: opacity;

  &.entered {
    opacity: 0.65;
  }
  &.entering {
    opacity: 0.65;
    transition: opacity ${DURATION}ms ease-out;
  }
  &.exited {
    opacity: 0;
  }
  &.exiting {
    opacity: 0;
    transition: opacity ${DURATION}ms ease-out;
  }
`;

const DrawerTopContainer = styled.div`
  position: absolute;
  top: 43px;
  right: 43px;
`;

const DrawerContent = styled.div`
  position: absolute;
  top: 0;
  left: ${p => (p.direction === "right" ? 0 : "unset")};
  right: ${p => (p.direction === "left" ? 0 : "unset")};
  bottom: 0;
  z-index: 1;
  box-sizing: border-box;
  padding: 0px 67px;
  width: 80%;
  background-color: ${p => p.theme.colors.palette.background.default};
  transition: transform ${DURATION}ms ease-out;
  max-width: 430px;
  will-change: transform;

  &.entering {
    transform: translateX(0);
  }
  &.entered {
    transform: translateX(0);
  }
  &.exiting {
    transform: translateX(
      ${p => (p.direction === "right" ? -100 : p.direction === "left" ? 100 : 0)}%
    );
  }
  &.exited {
    transform: translateX(
      ${p => (p.direction === "right" ? -100 : p.direction === "left" ? 100 : 0)}%
    );
  }
`;

const DrawerContainer = styled.div`
  color: ${p => p.theme.colors.palette.text.shade90};
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  z-index: 10;

  &.exited {
    pointer-events: none;
    visibility: hidden;
  }
`;

type DrawerProps = {
  children?: React$Node,
  isOpen?: boolean,
  onRequestClose?: (*) => void,
  direction?: "right" | "left",
};

export function SideDrawer({
  children,
  isOpen = false,
  onRequestClose,
  direction = "right",
}: DrawerProps) {
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
    <Transition in={isOpen} timeout={DURATION} onEntered={onEntered} onExited={onExited}>
      {state => (
        <DrawerContainer className={state} ref={focusTrapElem} tabIndex="-1">
          <DrawerContent isOpened={isOpen} className={state} direction={direction}>
            {onRequestClose ? (
              <DrawerTopContainer>
                <TouchButton onClick={onRequestClose}>
                  <IconCross size={24} />
                </TouchButton>
              </DrawerTopContainer>
            ) : null}
            {children}
          </DrawerContent>
          <DrawerBackdrop onClick={onRequestClose || undefined} className={state} />
        </DrawerContainer>
      )}
    </Transition>,
    // $FlowFixMe
    document.getElementById("modals"),
  );
}
