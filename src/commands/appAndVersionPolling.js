// @flow
import { createCommand, Command } from 'helpers/ipc'
import isEqual from 'lodash/isEqual'
import { from, concat, defer, interval } from 'rxjs'
import { catchError, first, concatMap, distinctUntilChanged, tap } from 'rxjs/operators'
import type TransportNodeHid from '@ledgerhq/hw-transport-node-hid'
import type { DeviceModelId } from '@ledgerhq/devices'
import getAppAndVersion from '@ledgerhq/live-common/lib/hw/getAppAndVersion'
import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'

type Result =
  | { connected: false }
  | {
      connected: true,
      name?: string,
      version?: string,
      deviceModelId: ?DeviceModelId,
    }

const appAndVersion = defer(() =>
  // $FlowFixMe
  withDevice('')((transport: TransportNodeHid) =>
    from(
      getAppAndVersion(transport).then(
        ({ name, version }) => ({
          connected: true,
          name,
          version,
          deviceModelId: transport.deviceModel && transport.deviceModel.id,
        }),
        () => ({
          // some error are legit (e.g. bootloader don't answer to that apdu) so we just fallback
          connected: true,
          deviceModelId: transport.deviceModel && transport.deviceModel.id,
        }),
      ),
    ),
  ),
)

const cmd: Command<void, Result> = createCommand('appAndVersionPolling', () => {
  let errorCount = 0
  const rec = () =>
    concat(
      appAndVersion.pipe(
        tap(() => {
          errorCount = 0
        }),
        catchError(() => {
          if (++errorCount === 3) {
            return from([{ connected: false }])
          }
          return from([])
        }),
      ),
      interval(1000).pipe(
        first(),
        concatMap(rec),
      ),
    )
  return rec().pipe(distinctUntilChanged(isEqual))
})

export default cmd
