// @flow
import type { Observable } from "rxjs";
import { from } from "rxjs";
import getOnboarding from "@ledgerhq/live-common/lib/hw/getOnboardingStatus";
import { withDevice } from "@ledgerhq/live-common/lib/hw/deviceAccess";

type Input = {
  deviceId: string,
};

const cmd = ({
  deviceId,
}: Input): Observable<{
  isOnboarded?: boolean,
  isRecoveryMode?: boolean,
  isSeedRecovery?: boolean,
  isConfirming?: boolean,
  seedSize?: SeedSize,
  currentWord?: number,
}> => withDevice(deviceId)(t => from(getOnboarding(t)));
export default cmd;
