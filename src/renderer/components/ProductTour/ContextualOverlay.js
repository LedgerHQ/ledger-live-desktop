// @flow

import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  useContext,
  useRef,
} from "react";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { Trans } from "react-i18next";
import Button from "~/renderer/components/Button";
import HelpBox from "~/renderer/components/ProductTour/HelpBox";
import styled from "styled-components";
import useResizeObserver from "~/renderer/hooks/useResizeObserver";
import ProductTourContext from "~/renderer/components/ProductTour/ProductTourContext";
import { useActiveFlow } from "~/renderer/components/ProductTour/hooks";
import OverlayShape from "~/renderer/components/ProductTour/assets/OverlayShape";
import { closeAllModal } from "~/renderer/actions/modals";
import { useDispatch } from "react-redux";

export type OverlayConfig = {|
  none?: boolean, // No help box
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

/**
  While in product tour all modals are backdropped by product tour, and show no animations
  this is to avoid jumpy splashes of time without the bg
 */
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
  const activeFlow = useActiveFlow();

  const rebuildOverlay = useCallback(() => {
    if (!selector) return;
    const el = document.querySelector(selector);
    let scroll, selectorScroll;

    if (conf.disableScroll) {
      // Nb take control of scrolling
      scroll = document.querySelector("#scroll-area");
      if (scroll) scroll.style.overflow = "visible";

      selectorScroll = document.querySelector(".select-options-list");
      if (selectorScroll) selectorScroll.style.overflow = "hidden";
    }

    if (el) {
      if (el !== elRef.current) elRef.current = el;
      // Nb spread ... destructuring doesn't work with DOMRect
      const { top, bottom, left, right } = el.getBoundingClientRect();
      if (t !== top || b !== bottom || l !== left || r !== right) {
        setBox({ t: top, b: bottom, l: left, r: right });
      }
    } else {
      setBox({ t: 0, b: 0, l: 0, r: 0 });
    }

    return () => {
      if (scroll) scroll.style.overflow = "hidden";
      if (selectorScroll) selectorScroll.style.overflow = "hidden auto";
    };
  }, [selector, conf, t, b, l, r]);

  const onNextOverlay = useCallback(() => {
    // NB If we have queued elements this is a non-action step for the user
    if (overlayQueue.length > 1 || conf.isDismissable) {
      send("NEXT_CONTEXTUAL_OVERLAY");
    }
  }, [conf, overlayQueue.length, send]);

  useResizeObserver(elRef, rebuildOverlay);
  useResizeObserver(ref, rebuildOverlay);
  useLayoutEffect(rebuildOverlay, [rebuildOverlay, overlayQueue[0]]);

  const onSkipTutorial = useCallback(() => {
    dispatch(closeAllModal());
    send("SKIP_FLOW");
  }, [dispatch, send]);

  const showOverlay = overlayQueue.length && (box || conf?.none);

  return activeFlow ? (
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
