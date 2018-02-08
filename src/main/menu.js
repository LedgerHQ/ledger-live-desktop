import { app, Menu } from 'electron'

const template = [
  ...(process.platform === 'darwin'
    ? [
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
        {
          role: 'window',
          submenu: [
            { role: 'close' },
            { role: 'minimize' },
            { role: 'zoom' },
            { type: 'separator' },
            { role: 'front' },
          ],
        },
      ]
    : []),
]

export default Menu.buildFromTemplate(template)
