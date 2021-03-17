// @flow

import React, { useLayoutEffect, useState, useCallback, useContext, useRef } from "react";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { Trans } from "react-i18next";
import Button from "~/renderer/components/Button";
import HelpBox from "~/renderer/components/ProductTour/HelpBox";
import styled from "styled-components";
import useResizeObserver from "~/renderer/hooks/useResizeObserver";
import ProductTourContext from "~/renderer/components/ProductTour/ProductTourContext";
import { useActiveFlow, useOnNextOverlay } from "~/renderer/components/ProductTour/hooks";
import OverlayShape from "~/renderer/components/ProductTour/assets/OverlayShape";
import { closeAllModal } from "~/renderer/actions/modals";
import { useDispatch } from "react-redux";

export type OverlayConfig = {|
  none?: boolean, //        No help box
  top?: boolean,
  bottom?: boolean,
  left?: boolean,
  right?: boolean,

  padding?: number, //      Extra padding around highlighted area

  skipOnLeft?: boolean, //  Show
  disableScroll?: boolean,

  isDismissable?: boolean,
  withFeedback?: boolean,
|};

const Wrapper: ThemedComponent<*> = styled.div`
  position: absolute;
  pointer-events: none;
  z-index: 104; /*To be above the modal backdrop */
  width: 100%;
  height: 100%;
  path {
    pointer-events: ${p => (p?.isDismissable ? "bounding-box" : "visiblepainted")};
  }
`;

/**
  While in product tour all modals are backdropped by product tour, and show no animations
  this is to avoid jumpy splashes of time without the bg
 */
const SkipWrapper = styled.div`
  ${p => (p.config.skipOnLeft ? "left" : "right")}: 50px;
  position: absolute;
  display: flex;
  flex-direction: row;
  bottom: 50px;
  pointer-events: auto;
`;

const Overlay = () => {
  const ref = useRef(null);
  const elRef = useRef(null);

  const { state, send } = useContext(ProductTourContext);
  const dispatch = useDispatch();
  const [box, setBox] = useState({});

  const { context } = state;
  const { overlays = [] } = context || {};
  const { selector, i18nKey, config } = overlays[0] || {};
  const { t, b, l, r } = box;
  const activeFlow = useActiveFlow();

  const rebuildOverlay = useCallback(() => {
    if (!selector) return;
    const els = document.querySelectorAll(selector);
    let scroll, selectorScroll, modalScroll;

    if (config.disableScroll) {
      // Nb take control of scrolling, ideally this would be less invasive.
      scroll = document.querySelector("#scroll-area");
      if (scroll) scroll.style.overflow = "visible";

      selectorScroll = document.querySelector(".select-options-list");
      if (selectorScroll) selectorScroll.style.overflow = "hidden";

      modalScroll = document.querySelector("#modal-content");
      if (modalScroll) {
        // modalScroll.style.overflow = "hidden";
        // modalScroll.style.paddingRight = "20px";
        // modalScroll.style.paddingTop = "20px";
      }
    }

    let box = {};
    for (const el of els) {
      if (el) {
        if (el !== elRef.current) elRef.current = el;
        // Nb spread ... destructuring doesn't work with DOMRect
        const { top, bottom, left, right } = el.getBoundingClientRect();

        // Attempt top extend the box to contain all elements.
        box = {
          t: box.t ? Math.min(top, box.t) : top,
          b: box.b ? Math.max(bottom, box.b) : bottom,
          l: box.l ? Math.min(left, box.l) : left,
          r: box.r ? Math.min(right, box.r) : right,
        };
      } else {
        setBox({ t: 0, b: 0, l: 0, r: 0 });
      }
    }
    if (t !== box.t || b !== box.b || l !== box.l || r !== box.r) {
      setBox({ t: box.t, b: box.b, l: box.l, r: box.r });
    } else {
      setBox(box);
    }

    return () => {
      if (scroll) scroll.style.overflow = "hidden";
      if (selectorScroll) selectorScroll.style.overflow = "hidden auto";
      if (modalScroll) {
        // modalScroll.style.overflow = "scroll";
        // modalScroll.style.paddingRight = "0";
        // modalScroll.style.paddingTop = "0";
      }
    };
  }, [selector, config, t, b, l, r]);

  useResizeObserver(elRef, rebuildOverlay);
  useResizeObserver(ref, rebuildOverlay);
  useLayoutEffect(rebuildOverlay, [rebuildOverlay, overlays[0]]);

  const onNextOverlay = useOnNextOverlay();
  const onSkipTutorial = useCallback(() => {
    dispatch(closeAllModal());
    send("SKIP_FLOW");
  }, [dispatch, send]);

  const onExitProductTour = useCallback(() => {
    dispatch(closeAllModal());
    send("EXIT");
  }, [dispatch, send]);

  const showOverlay = overlays.length && (box || config?.none);

  return activeFlow ? (
    <Wrapper
      ref={ref}
      isDismissable={config?.isDismissable}
      onClick={config?.isDismissable ? onNextOverlay : undefined}
    >
      {showOverlay ? <OverlayShape config={config} t={t} b={b} l={l} r={r} /> : null}
      {showOverlay ? <HelpBox i18nKey={i18nKey} config={config} t={t} b={b} l={l} r={r} /> : null}
      {state.matches("flow.landing") || state.matches("dashboard") ? null : (
        <SkipWrapper config={config || {}}>
          <Button onClick={onSkipTutorial} outlineWhite alignItems={"flex-end"}>
            <Trans i18nKey={"productTour.flows.skipFlow"} />
          </Button>
          {__DEV__ ? (
            <Button ml={2} onClick={onExitProductTour} danger alignItems={"flex-end"}>
              {"X"}
            </Button>
          ) : null}
        </SkipWrapper>
      )}
    </Wrapper>
  ) : null;
};

export default Overlay;
