// @flow

import { useSetOverlays } from "~/renderer/components/ProductTour/hooks";

// FIXME typings
const QueueOverlay = ({ queue, condition }: any) => {
  const maybeArray = Array.isArray(queue) ? queue : [queue];
  useSetOverlays(condition, ...maybeArray);
  return null;
};

export default QueueOverlay;
