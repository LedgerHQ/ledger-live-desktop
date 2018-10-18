import { Application } from 'spectron'

import { waitForDisappear, waitForExpectedText } from './helpers'

const os = require('os')
const appVersion = require('../package.json')

let app

const TIMEOUT = 50 * 1000

let app_path
const platform = os.platform()
if (platform === 'darwin') {
  app_path = `./dist/mac/Ledger Live.app/Contents/MacOS/Ledger Live`
} else if (platform === 'win32') {
  app_path = `.\\dist\\win-unpacked\\Ledger Live.exe`
} else {
  app_path = `./dist/ledger-live-desktop-${appVersion.version}-linux-x86_64.AppImage`
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
    'Start app, skip onboarding, check Empty State, check General Settings and verify Developer mode',
    async () => {
      const title = await app.client.getTitle()
      expect(title).toEqual('Ledger Live')
      await app.client.waitUntilWindowLoaded()
      await waitForDisappear(app, '#preload')

      // Post Onboarding (Analytics)
      const analytics_title = await waitForExpectedText(
        app,
        '[data-e2e=onboarding_title]',
        'Analytics and bug reports',
      )
      // Verify "Technical Data" + Link "Learn more"
      const analytics_techData_title = await app.client.getText('[data-e2e=analytics_techData]')
      expect(analytics_techData_title).toEqual('Technical data *')
      await app.client.click('[data-e2e=analytics_techData_Link]')
      await waitForExpectedText(app, '[data-e2e=modal_title]', 'Technical data')
      await app.client.click('[data-e2e=modal_buttonClose_techData]')
      analytics_title

      // Verify "Share analytics" + Link "Learn more"
      const analytics_shareAnalytics_title = await app.client.getText(
        '[data-e2e=analytics_shareAnalytics]',
      )
      expect(analytics_shareAnalytics_title).toEqual('Share analytics')
      await app.client.click('[data-e2e=analytics_shareAnalytics_Link]')
      await waitForExpectedText(app, '[data-e2e=modal_title]', 'Share analytics')
      await app.client.click('[data-e2e=modal_buttonClose_shareAnalytics]')
      analytics_title

      // Verify "Report bugs"
      const analytics_reportBugs_title = await app.client.getText('[data-e2e=analytics_reportBugs]')
      expect(analytics_reportBugs_title).toEqual('Report bugs')

      await app.client.click('[data-e2e=continue_button]')

      // Finish Onboarding
      await waitForExpectedText(app, '[data-e2e=finish_title]', 'Your device is ready!')
      await app.client.click('[data-e2e=continue_button]')

      await waitForExpectedText(app, '[data-e2e=modal_title]', 'Trade safely')
      await app.client.click('[data-e2e=continue_button]')

      // Dashboard EmptyState
      await waitForExpectedText(
        app,
        '[data-e2e=dashboard_empty_title]',
        'Add accounts to your portfolio',
      )
      const openManager_button = await app.client.getText('[data-e2e=dashboard_empty_OpenManager]')
      expect(openManager_button).toEqual('Open Manager')
      const addAccount_button = await app.client.getText('[data-e2e=dashboard_empty_AddAccounts]')
      expect(addAccount_button).toEqual('Add accounts')

      // Open Settings
      await app.client.click('[data-e2e=setting_button]')
      await waitForExpectedText(app, '[data-e2e=settings_title]', 'Settings')
      // Verify settings General section
      const settingsGeneral_title = await app.client.getText('[data-e2e=settingsGeneral_title]')
      expect(settingsGeneral_title).toEqual('General')

      // TO ADD : VERIFY PASSWORD LOCK VALUE = DISABLE ???
      // Report bugs = OFF
      await app.client.click('[data-e2e=reportBugs_button]')

      // Analytics = ON
      await app.client.click('[data-e2e=shareAnalytics_button]')

      // DevMode = ON
      await app.client.click('[data-e2e=devMode_button]')

      // Verify Dev mode
      // Add New Account
      await app.client.click('[data-e2e=menuAddAccount_button]')
      await waitForExpectedText(app, '[data-e2e=modal_title]', 'Add accounts')

      // Select Bitcoin Testnet from dropdown list
      await app.client.setValue('[data-e2e=modalBody] input', 'Bitcoin testnet')
      await app.client.keys('Enter')
      const currencyBadge = await app.client.getText('[data-e2e=currencyBadge]')
      expect(currencyBadge).toEqual('Bitcoin Testnet')
    },
    TIMEOUT,
  )
})
