import { waitForDisappear, waitForExpectedText } from './helpers'

import { applicationProxy } from './applicationProxy'

// const os = require('os')
// const appVersion = require('../package.json')

let app

const TIMEOUT = 50 * 1000

describe('Application launch', () => {
  beforeEach(async () => {
    app = applicationProxy('app.json', {SKIP_ONBOARDING: '1'})
    await app.start()
  }, TIMEOUT)

  afterEach(async () => {
    if (app && app.isRunning()) {
      await app.stop()
    }
  }, TIMEOUT)

  test(
    'Start app, check General Settings and verify Developer mode',
    async () => {
      const title = await app.client.getTitle()
      expect(title).toEqual('Ledger Live')
      await app.client.waitUntilWindowLoaded()
      await waitForDisappear(app, '#preload')

      // Open Settings
      await app.client.click('[data-e2e=settingButton]')
      await waitForExpectedText(app, '[data-e2e=settings_title]', 'Settings')
      // Verify settings General section
      const settingsGeneral_title = await app.client.getText('[data-e2e=settingsSection_title]')
      expect(settingsGeneral_title).toEqual('General')

      // Report bugs = OFF
      await app.client.click('[data-e2e=reportBugs_button]')

      // Analytics = OFF
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
