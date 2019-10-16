// @flow

import { useDeviceFlow } from './useDeviceFlow'
import selectApp from './selectApp'
import connectAndUnlock from './connectAndUnlock'

const flows = {
  device: connectAndUnlock,
  address: selectApp,
}

type Props = {
  flowId: number,
  children: any,
  openOnMount?: boolean,
}

export default ({ flowId, children, openOnMount = false }: Props) => {
  const animation = flows[flowId]

  const deviceState = useDeviceFlow(animation, { open: !openOnMount })

  return children(deviceState)
}
