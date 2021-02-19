// @flow

import React, { useCallback, useEffect, useRef } from "react";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { useDispatch } from "react-redux";
import { openModal } from "~/renderer/actions/modals";
import type { StateNode } from "xstate";
import { setHasCompletedProductTour } from "~/renderer/actions/settings";
import type { OverlayConfig } from "~/renderer/components/ProductTour/ContextualOverlay";
const ProductTourContext = React.createContext<StateNode>();
type ProductTourState = {
  totalFlows: number,
  completedFlows: Array<string>,
  activeFlow: ?string,
  showSuccessModal: boolean,
  overrideContent: boolean,
  isControlledModal: boolean,
  controlledModals: Array<string>,
  overlayQueue?: Array<{
    selector: string,
    i18nKey?: string,
    conf: OverlayConfig,
  }>,
  extras: {},
  onBeforeFlow: ?() => void,
  onAfterFlow: ?() => void,
};

const initialContext: ProductTourState = {
  totalFlows: 7,
  completedFlows: [],
  onBeforeFlow: undefined,
  onAfterFlow: undefined,
  activeFlow: "",
  showSuccessModal: false,
  overrideContent: false,
  isControlledModal: false,
  controlledModals: [],
  overlayQueue: [],
  extras: {},
};

const productTourMachine = Machine(
  {
    id: "productTour",
    context: initialContext,
    initial: "idle",
    states: {
      idle: {
        id: "idle",
        on: {
          ENTER_DASHBOARD: {
            target: "dashboard",
          },
        },
      },
      dashboard: {
        id: "dashboard",
        entry: assign({
          activeFlow: "",
          showSuccessModal: false,
        }),
        on: {
          ENTER_FLOW: {
            target: "flow.landing",
            actions: assign((_, e) => ({
              activeFlow: e.appFlow,
              onBeforeFlow: e.onBeforeFlow,
              onAfterFlow: e.onAfterFlow,
              overrideContent: !!e.overrideContent,
              learnMoreCallback: e.learnMoreCallback,
              controlledModals: e.controlledModals || [],
              overlayQueue: initialContext.overlayQueue,
            })),
          },
          BACK: {
            target: "idle",
          },
        },
      },
      flow: {
        states: {
          landing: {
            on: {
              START_FLOW: {
                target: "ongoing",
                actions: ["flowStarted", assign({ isControlledModal: false })],
              },
              BACK: "#dashboard",
              EXIT: "#idle",
            },
          },
          ongoing: {
            on: {
              BACK: {
                target: "#dashboard",
                actions: [
                  assign({
                    overlayQueue: initialContext.overlayQueue,
                  }),
                  "flowExited",
                ],
              },
              EXIT: {
                target: "#idle",
                actions: assign({
                  overlayQueue: initialContext.overlayQueue,
                }),
              },
              CONTROL_MODAL: {
                actions: assign({
                  isControlledModal: true,
                }),
              },
              SET_CONTEXTUAL_OVERLAY_QUEUE: {
                actions: assign((_, event) => ({
                  overlayQueue: event.overlayQueue,
                })),
              },
              CLEAR_CONTEXTUAL_OVERLAY_QUEUE: {
                actions: assign(() => ({
                  overlayQueue: initialContext.overlayQueue,
                })),
              },
              NEXT_CONTEXTUAL_OVERLAY: {
                actions: assign(state => {
                  const overlayQueue = state.overlayQueue.slice(1);
                  return {
                    overlayQueue: overlayQueue.length ? overlayQueue : initialContext.overlayQueue,
                  };
                }),
              },
              COMPLETE_FLOW: {
                target: "completed",
                actions: assign({
                  completedFlows: ({ completedFlows, activeFlow }) => [
                    ...completedFlows,
                    activeFlow,
                  ],
                  extras: (_, event) => event.extras || {},
                  showSuccessModal: true,
                  isControlledModal: false,
                  overlayQueue: initialContext.overlayQueue,
                }),
              },
              SKIP_FLOW: {
                target: "#dashboard",
                actions: assign({
                  completedFlows: ({ completedFlows, activeFlow }) => [
                    ...completedFlows,
                    activeFlow,
                  ],
                  isControlledModal: false,
                  overlayQueue: initialContext.overlayQueue,
                }),
              },
            },
          },
          completed: {
            on: {
              CLOSE: {
                target: "#dashboard",
                actions: "flowCompleted",
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      flowStarted: (context, event) => context.onBeforeFlow(),
      flowCompleted: (context, event) => context.onAfterFlow(),
      flowExited: (context, event) => context.onAfterFlow(), // NB maybe we need a specific action?
    },
  },
);

export const ProductTourProvider = ({ children }: { children: React$Node }) => {
  const { localStorage } = window;
  const dispatch = useDispatch();
  const [state, send] = useMachine(productTourMachine, {
    context: {
      ...initialContext,
      completedFlows: JSON.parse(localStorage.productTourCompletedFlows || "[]"),
    },
  });

  useEffect(() => console.log({ state }), [state]);

  const { context } = state;
  const { activeFlow, extras, showSuccessModal, completedFlows, totalFlows } = context;
  const completedFlowsRef = useRef(completedFlows);

  const persistCompletedFlows = useCallback(() => {
    localStorage.setItem("productTourCompletedFlows", JSON.stringify(context.completedFlows));
  }, [context.completedFlows, localStorage]);

  useEffect(() => {
    if (completedFlowsRef.current !== completedFlows) {
      if (showSuccessModal) {
        dispatch(openModal("MODAL_PRODUCT_TOUR_SUCCESS", { activeFlow, extras }));
      }
      if (completedFlows.length === totalFlows) {
        dispatch(setHasCompletedProductTour(true));
      }
      persistCompletedFlows();
    }
  }, [
    activeFlow,
    completedFlows,
    context,
    dispatch,
    extras,
    persistCompletedFlows,
    showSuccessModal,
    totalFlows,
  ]);

  return (
    <ProductTourContext.Provider value={{ state, send }}>{children}</ProductTourContext.Provider>
  );
};

export default ProductTourContext;
