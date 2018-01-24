// @flow

import { clipboard } from 'electron'

type Props = {
  data: string,
  render: Function,
}

function CopyToClipboard(props: Props) {
  const { render, data } = props
  return render(() => clipboard.writeText(data))
}

export default CopyToClipboard
