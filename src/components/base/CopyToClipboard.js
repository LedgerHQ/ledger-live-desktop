// @flow

let clipboard = null

if (!process.env.STORYBOOK_ENV) {
  const electron = require('electron')
  clipboard = electron.clipboard // eslint-disable-line
}

type Props = {
  data: string,
  render: Function,
}

function CopyToClipboard(props: Props) {
  const { render, data } = props

  if (clipboard === null) {
    return render()
  }

  return render(() => clipboard && clipboard.writeText(data))
}

export default CopyToClipboard
