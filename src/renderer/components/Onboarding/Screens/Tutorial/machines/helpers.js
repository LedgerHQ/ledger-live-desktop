import { assign } from "xstate";

export const setStepperStatus = status =>
  assign({
    steps: ({ steps }) =>
      steps.map(step => {
        if (status[step.id]) {
          return {
            ...step,
            status: status[step.id],
          };
        }
        return step;
      }),
  });
