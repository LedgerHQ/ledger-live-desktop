// @flow
import type { DeviceModelId } from "@ledgerhq/devices";
import { renderLoading } from "~/renderer/components/DeviceAction/rendering";

type Props = {
  modelId: DeviceModelId,
  children?: React$Node,
};

const StepProgress = ({ children, modelId }: Props) => renderLoading({ modelId, children });

export default StepProgress;
