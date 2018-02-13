import { BrowserWindow, app, Menu } from 'electron'

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
  ...props(process.platform === 'darwin' || __DEV__, [
    {
      role: 'window',
      submenu: [
        ...props(
          __DEV__,
          [
            {
              label: 'App Dev Tools',
              click() {
                const devWindow = BrowserWindow.getAllWindows().find(w => w.name === 'DevWindow')
                if (devWindow) {
                  devWindow.show()
                }
              },
            },
            {
              label: 'Main Window Dev Tools',
              click() {
                const mainWindow = BrowserWindow.getAllWindows().find(w => w.name === 'MainWindow')
                if (mainWindow) {
                  mainWindow.openDevTools({
                    mode: process.env.DEV_TOOLS_MODE,
                  })
                }
              },
            },
            { type: 'separator' },
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
  ]),
]

export default Menu.buildFromTemplate(template)
