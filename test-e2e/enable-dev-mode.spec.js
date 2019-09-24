import { waitForDisappear, waitForExpectedText } from './helpers'
import { applicationProxy } from './applicationProxy'

import * as selector from './selectors'

let app

const TIMEOUT = 50 * 1000

describe(
  'Enabling developer mode should add testnets to Add account flow',
  () => {
    beforeAll(async () => {
      app = applicationProxy('btcFamily.json', { SKIP_ONBOARDING: '1' })
      await app.start()
    }, TIMEOUT)

    afterAll(async () => {
      if (app && app.isRunning()) {
        await app.stop()
      }
    }, TIMEOUT)

    test(
      'Launch app check release note',
      async () => {
        const title = await app.client.getTitle()
        expect(title).toEqual('Ledger Live')
        await app.client.waitUntilWindowLoaded()
        await waitForDisappear(app, '#preload')
        // Check Release note
        await waitForExpectedText(app, selector.modal_title, 'Release notes')
        await app.client.click(selector.button_closeReleaseNote)
      },
      TIMEOUT,
    )

    test(
      'Go to Experimental Settings and enable developer mode',
      async () => {
        await app.client.click(selector.button_settings)
        await waitForExpectedText(app, selector.settings_title, 'Settings')
        await waitForExpectedText(app, selector.settingsSection_title, 'General')
        // Go to Experimental
        await app.client.click('[data-e2e=tabs_experimental]')
        const section_title = await app.client.getText(selector.settingsSection_title)
        expect(section_title).toEqual('Experimental features')
        await app.client.click('[data-e2e=MANAGER_DEV_MODE_button]')
      },
      TIMEOUT,
    )

    test(
      'Go to account page and open add Account flow',
      async () => {
        await app.client.click(selector.sidebar_accounts)
        await waitForExpectedText(app, selector.accounts_title, 'Accounts')
        await app.client.click(selector.button_addAccount)
        await waitForExpectedText(app, selector.modal_title, 'Add accounts')
      },
      TIMEOUT,
    )

    test(
      'Testnet currencies should be available',
      async () => {
        await app.client.setValue('.select__input input', 'Bitcoin testnet')
        await app.client.keys('Enter')
        const currency = await app.client.getText(selector.currencybadge)
        expect(currency).toEqual('Bitcoin Testnet')
      },
      TIMEOUT,
    )
  },
  TIMEOUT,
)
