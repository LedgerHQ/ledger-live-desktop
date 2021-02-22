// @flow

import React, { useCallback, useEffect, useRef } from "react";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { useDispatch } from "react-redux";
import { openModal } from "~/renderer/actions/modals";
import type { StateNode } from "xstate";
import { setHasCompletedProductTour } from "~/renderer/actions/settings";
import type { OverlayConfig } from "~/renderer/components/ProductTour/Overlay";
const ProductTourContext = React.createContext<StateNode>();
type ProductTourState = {
  totalFlows: number,
  completedFlows: Array<string>,
  activeFlow: ?string,
  showSuccessModal: boolean,
  overrideContent: boolean,
  isControlledModal: boolean,
  controlledModals: Array<string>,
  overlays?: Array<{
    selector: string,
    i18nKey?: string,
    config: OverlayConfig,
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
  overlays: [],
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
              overlays: initialContext.overlays,
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
                    overlays: initialContext.overlays,
                  }),
                  "flowExited",
                ],
              },
              EXIT: {
                target: "#idle",
                actions: assign({
                  overlays: initialContext.overlays,
                  activeFlow: "",
                }),
              },
              CONTROL_MODAL: {
                actions: assign({
                  isControlledModal: true,
                }),
              },
              SET_OVERLAYS: {
                actions: assign((_, event) => ({
                  overlays: event.overlays,
                })),
              },
              CLEAR_OVERLAYS: {
                actions: assign(() => ({
                  overlays: initialContext.overlays,
                })),
              },
              NEXT_OVERLAY: {
                actions: assign(state => {
                  const Overlays = state.overlays.slice(1);
                  return {
                    overlays: Overlays.length ? Overlays : initialContext.overlays,
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
                  overlays: initialContext.overlays,
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
                  overlays: initialContext.overlays,
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
