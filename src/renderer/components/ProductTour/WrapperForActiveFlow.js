// @flow

import { useActiveFlow } from "~/renderer/components/ProductTour/hooks";

const WrapperForActiveFlow = ({ flow, children }: { flow: string, children: React$Node }) => {
  const activeFlow = useActiveFlow();
  return activeFlow === flow ? children : null;
};

export default WrapperForActiveFlow;
