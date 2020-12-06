// @flow

import { useSetContextualOverlayQueue } from "~/renderer/components/ProductTour/hooks";

const QueueContextualOverlay = ({ queue, condition }) => {
  useSetContextualOverlayQueue(condition, queue);
  return null;
};

export default QueueContextualOverlay;
