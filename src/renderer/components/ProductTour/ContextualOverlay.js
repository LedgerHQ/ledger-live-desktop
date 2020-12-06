// @flow

import React, { useLayoutEffect, useState, useCallback, useContext, useRef } from "react";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { Trans } from "react-i18next";
import Button from "~/renderer/components/Button";
import HelpBox from "~/renderer/components/ProductTour/HelpBox";
import styled from "styled-components";
import useResizeObserver from "~/renderer/hooks/useResizeObserver";
import ProductTourContext from "~/renderer/components/ProductTour/ProductTourContext";
import OverlayShape from "~/renderer/components/ProductTour/assets/OverlayShape";
import { closeAllModal } from "~/renderer/actions/modals";
import { useDispatch } from "react-redux";

export type OverlayConfig = {|
  top?: boolean,
  bottom?: boolean,
  left?: boolean,
  right?: boolean,
  isModal?: boolean,
  skipOnLeft?: boolean,
  disableScroll?: boolean,
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

const SkipWrapper = styled.div`
  position: absolute;
  display: block;
  ${p => (p.conf.skipOnLeft ? "left" : "right")}: 50px;
  bottom: 50px;
  pointer-events: auto;
`;

const ContextualOverlay = ({ isModal }: { isModal?: boolean }) => {
  const ref = useRef(null);
  const elRef = useRef(null);

  const { state, send } = useContext(ProductTourContext);
  const dispatch = useDispatch();
  const [box, setBox] = useState({});

  const { context } = state;
  const { overlayQueue = [] } = context || {};
  const { selector, i18nKey, conf } = overlayQueue[0] || {};
  const { t, b, l, r } = box;

  const rebuildOverlay = useCallback(() => {
    if (!selector) return;
    const el = document.querySelector(selector);
    const scroll = document.querySelectorAll("#scroll-area, .select-options-list");

    if (conf.disableScroll && scroll) {
      for (const e of scroll) e.style.overflow = "hidden";
    }

    if (el) {
      if (el !== elRef.current) elRef.current = el;
      // Nb spread ... destructuring doesn't work with DOMRect
      const { top, bottom, left, right } = el.getBoundingClientRect();
      if (t !== top || b !== bottom || l !== left || r !== right) {
        setBox({ t: top, b: bottom, l: left, r: right });
      }
    }

    // When needed return the target element z-index to normal.
    return () => {
      if (scroll) {
        for (const e of scroll) e.style.overflow = "hidden auto";
      }
    };
  }, [selector, conf, overlayQueue.length, t, b, l, r]);

  const onNextOverlay = useCallback(() => {
    // NB If we have queued elements this is a non-action step for the user
    if (overlayQueue.length > 1 || conf.isDismissable) {
      send("NEXT_CONTEXTUAL_OVERLAY");
    }
  }, [overlayQueue.length, send]);

  useResizeObserver(elRef, rebuildOverlay);
  useResizeObserver(ref, rebuildOverlay);
  useLayoutEffect(rebuildOverlay, [rebuildOverlay, overlayQueue[0]]);

  const onSkipTutorial = useCallback(() => {
    dispatch(closeAllModal());
    send("SKIP_FLOW");
  }, [send]); // TODO mark as skipped
  const active = isModal === conf?.isModal;
  const showSkip = state.matches("flow.ongoing");
  const showOverlay = overlayQueue.length && box;

  return showSkip ? (
    <Wrapper ref={ref} isDismissable={conf?.isDismissable} onClick={onNextOverlay}>
      {showOverlay ? <OverlayShape t={t} b={b} l={l} r={r} /> : null}
      {showOverlay ? <HelpBox i18nKey={i18nKey} conf={conf} t={t} b={b} l={l} r={r} /> : null}
      <SkipWrapper conf={conf || {}}>
        <Button onClick={onSkipTutorial} outlineWhite alignItems={"flex-end"}>
          <Trans i18nKey={"productTour.flows.skipFlow"} />
        </Button>
      </SkipWrapper>
    </Wrapper>
  ) : null;
};

export default ContextualOverlay;
