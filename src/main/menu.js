import { BrowserWindow, app, Menu } from 'electron'

const { DEV_TOOLS, DEV_TOOLS_MODE } = process.env

const props = (predicate, values, defaultValue = {}) => (predicate ? values : defaultValue)

const template = [
  ...props(
    process.platform === 'darwin',
    [
      {
        label: app.getName(),
        submenu: [
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' },
        ],
      },
    ],
    [],
  ),
  ...[
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
      ],
    },
  ],
  ...props(
    process.platform === 'darwin' || __DEV__ || DEV_TOOLS,
    [
      {
        role: 'window',
        submenu: [
          ...props(
            __DEV__ || DEV_TOOLS,
            [
              {
                label: 'Main Window Dev Tools',
                click() {
                  const mainWindow = BrowserWindow.getAllWindows().find(
                    w => w.name === 'MainWindow',
                  )
                  if (mainWindow) {
                    mainWindow.openDevTools({
                      mode: DEV_TOOLS_MODE,
                    })
                  }
                },
              },
              ...props(process.platform === 'darwin', [{ type: 'separator' }], []),
            ],
            [],
          ),
          ...props(
            process.platform === 'darwin',
            [
              { role: 'close' },
              { role: 'minimize' },
              { role: 'zoom' },
              { type: 'separator' },
              { role: 'front' },
            ],
            [],
          ),
        ],
      },
    ],
    [],
  ),
]

export default Menu.buildFromTemplate(template)
