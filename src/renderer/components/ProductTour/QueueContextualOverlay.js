// @flow

import { useSetContextualOverlayQueue } from "~/renderer/components/ProductTour/hooks";

const QueueContextualOverlay = ({ queue, condition }) => {
  const maybeArray = Array.isArray(queue) ? queue : [queue];
  useSetContextualOverlayQueue(condition, ...maybeArray);
  return null;
};

export default QueueContextualOverlay;
