import { waitForDisappear, waitForExpectedText } from './helpers'
import { applicationProxy } from './applicationProxy'

import * as css from './css_Path'

let app

const TIMEOUT = 50 * 1000

describe('Application launch', () => {
  beforeEach(async () => {
    app = applicationProxy('btcFamily.json', {SKIP_ONBOARDING: '1'})
    await app.start()
  }, TIMEOUT)

  afterEach(async () => {
    if (app && app.isRunning()) {
      await app.stop()
    }
  }, TIMEOUT)

  test(
    'Enabling developer mode should add testnets to Add account flow',
    async () => {
      const title = await app.client.getTitle()
      expect(title).toEqual('Ledger Live')
      await app.client.waitUntilWindowLoaded()
      await waitForDisappear(app, '#preload')

      // Check Release note
      await waitForExpectedText(app, css.modal_title, 'Release notes')
      await app.client.click(css.button_closeReleaseNote)

      // Go to settings
      await app.client.click(css.button_settings)
      await waitForExpectedText(app, css.settings_title, 'Settings')
      await waitForExpectedText(app, css.settingsSection_title, 'General')
      await app.client.click('[data-e2e=sections_title]')[4]

      //await sections.selectByVisibleText('Experimental features');

      // Check Experimentals section
      const section_title = await app.client.getText(css.settingsSection_title)
      expect(section_title).toEqual('Experimental features')

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
