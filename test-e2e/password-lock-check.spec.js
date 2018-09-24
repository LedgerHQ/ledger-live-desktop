import { Application } from 'spectron'
import { waitForDisappear, waitForExpectedText } from './helpers'

const os = require('os')
const appVersion = require('../package.json')

let app

const TIMEOUT = 50 * 1000

let app_path
let configPath
const platform = os.platform()
if (platform === 'darwin') {
  app_path = `./dist/mac/Ledger Live.app/Contents/MacOS/Ledger Live`
  configPath = `~/Library/Application Support/Ledger Live/`
} else if (platform === 'win32') {
  app_path = `.\\dist\\win-unpacked\\Ledger Live.exe`
  configPath = '%AppData\\Roaming\\Ledger Live'
} else {
  app_path = `./dist/ledger-live-desktop-${appVersion.version}-linux-x86_64.AppImage`
  configPath = '$HOME/apps/ledger-live-desktop-$ledgerLiveVersion-linux-x86_64.AppImage'
}

describe('Application launch', () => {
  beforeEach(async () => {
    app = new Application({
      path: app_path,
      env: {
        SKIP_ONBOARDING: '1',
      },
    })
    await app.start()
  }, TIMEOUT)

  afterEach(async () => {
    if (app && app.isRunning()) {
      await app.stop()
    }
  }, TIMEOUT)

  test(
    'Start app, activate password lock, check app.json, deactivate password lock',
    async () => {
      const title = await app.client.getTitle()
      expect(title).toEqual('Ledger Live')
      await app.client.waitUntilWindowLoaded()
      await waitForDisappear(app, '#preload')
      // Verify Account summary text
      // Count user's accounts
      const userAccountsList = await app.client.elements('[data-e2e=dashboard_AccountCardWrapper]')
      const userAccountsCount = await Object.keys(userAccountsList.value).length
      // Check account number
      const accountSummary = await app.client.getText('[data-e2e=dashboard_accountsSummaryDesc]')
      const accountSummaryMessage = `Here's the summary of your ${userAccountsCount} accounts`
      expect(accountSummary).toEqual(accountSummaryMessage)

      // Go to settings
      await app.client.click('[data-e2e=setting_button]')
      await waitForExpectedText(app, '[data-e2e=settings_title]', 'Settings')

      // Enable lock password
      await app.client.click('[data-e2e=passwordLock_button]')
      await waitForExpectedText(app, '[data-e2e=setPassword_modalTitle]', 'Set a password')
      await app.client.setValue('[data-e2e=setPassword_NewPassword]', 5)
      await app.client.setValue('[data-e2e=setPassword_ConfirmPassword]', 5)
      await app.client.keys('Enter')
      await waitForExpectedText(app, '[data-e2e=settings_title]', 'Settings')

      // Verify in app.json that accounts data are encrypted
      const tmpAppJSONPath = `${configPath} + "app.json"`
      const accountsOperations = '"operations": [{'
      expect(tmpAppJSONPath).not.toContain(accountsOperations)

      // Desable password lock
      await app.client.click('[data-e2e=passwordLock_button]')
      await waitForExpectedText(app, '[data-e2e=modal_title]', 'Disable password lock')
      await app.client.setValue('#password', 5)
      await app.client.keys('Enter')
      await waitForExpectedText(app, '[data-e2e=settings_title]', 'Settings')
      await app.client.pause(1000)
    },
    TIMEOUT,
  )
})
