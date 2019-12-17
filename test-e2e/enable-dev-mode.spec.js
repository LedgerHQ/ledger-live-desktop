import { waitForDisappear, waitForExpectedText } from './helpers'
import { applicationProxy, getScreenshotPath } from './applicationProxy'
import * as selector from './selectors'

const { toMatchImageSnapshot } = require('jest-image-snapshot')

expect.extend({ toMatchImageSnapshot })

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
      'App start',
      async () => {
        const title = await app.client.getTitle()
        expect(title).toEqual('Ledger Live')
        await app.client.waitUntilWindowLoaded()
        await waitForDisappear(app, '#preload')
      },
      TIMEOUT,
    )

    test(
      'Terms of use modal should be displayed',
      async () => {
        const titleModal = await app.client.getText(selector.modal_title)
        expect(titleModal).toEqual('Terms of Use')
        let image = await app.client.saveScreenshot(getScreenshotPath('termsOfUse_off'))
        expect(image).toMatchImageSnapshot({
          failureThreshold: 0.05,
          failureThresholdType: 'percent'
        })
        expect(await app.client.isEnabled(selector.button_continue)).toEqual(false)
        await app.client.click(selector.checkbox_termsOfUse)

        await app.client.pause(1000)
        image = await app.client.saveScreenshot(getScreenshotPath('termsOfUse_on'))
        expect(image).toMatchImageSnapshot({
          failureThreshold: 0.05,
          failureThresholdType: 'percent'
        })
        expect(await app.client.isEnabled(selector.button_continue)).toEqual(true)
        await waitForExpectedText(app, selector.button_continue, 'Confirm')
        await app.client.click(selector.button_continue)
      },
      TIMEOUT,
    ) 

    // test(
    //   'Release Note should be displayed',
    //   async () => {
    //     await waitForExpectedText(app, selector.modal_title, 'Release notes')
    //     app.client.pause(1000)
    //     const image = await app.client.saveScreenshot(getScreenshotPath('releaseNote'))
    //     expect(image).toMatchImageSnapshot({
    //       failureThreshold: 0.05,
    //       failureThresholdType: 'percent'
    //     })
    //     await app.client.click(selector.button_closeReleaseNote)
    //   },
    //   TIMEOUT,
    // )

    test(
      'Go to Experimental Settings and enable developer mode',
      async () => {
        await app.client.click(selector.button_settings)
        await waitForExpectedText(app, selector.settings_title, 'Settings')
        await waitForExpectedText(app, selector.settingsSection_title, 'General')
        
        await app.client.click(selector.tab_experimental)
        const section_title = await app.client.getText(selector.settingsSection_title)
        expect(section_title).toEqual('Experimental features')
        const image = await app.client.saveScreenshot(getScreenshotPath('experimentals'))
        expect(image).toMatchImageSnapshot({
          failureThreshold: 0.02,
          failureThresholdType: 'percent'
        })
        await app.client.click(selector.button_devmode)
      },
      TIMEOUT,
    )

    test(
      'Go to account page and open add Account flow',
      async () => {
        await app.client.click(selector.sidebar_accounts)
        await waitForExpectedText(app, selector.accounts_title, 'Accounts')
        let image = await app.client.saveScreenshot(getScreenshotPath('accounts'))
        expect(image).toMatchImageSnapshot({
          failureThreshold: 0.02,
          failureThresholdType: 'percent'
        })
        await app.client.click(selector.button_addAccount)
        await waitForExpectedText(app, selector.modal_title, 'Add accounts')
        image = await app.client.saveScreenshot(getScreenshotPath('account'))
        expect(image).toMatchImageSnapshot({
          failureThreshold: 0.02,
          failureThresholdType: 'percent'
        })
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
        const image = await app.client.saveScreenshot(getScreenshotPath('account'))
        expect(image).toMatchImageSnapshot({
          failureThreshold: 0.02,
          failureThresholdType: 'percent'
        })
      },
      TIMEOUT,
    )

  test(
    'Disable developer mode',
    async () => {
      await app.client.click(selector.button_close)
      await waitForExpectedText(app, selector.accounts_title, 'Accounts')
      await app.client.click(selector.flag_experimental)
      await waitForExpectedText(app, selector.settingsSection_title, 'Experimental features')
      await app.client.click(selector.button_devmode)
      await app.client.click(selector.sidebar_portfolio)
      await waitForExpectedText(
        app,
        selector.portfolio_assetDistribution_tile,
        'Asset allocation (',
      )
      expect(selector.flag_experimental).toBeNull
      },
    TIMEOUT,
    )

  test(
    'Testnet currencies should not be available',
    async () => {
      await app.client.click(selector.sidebar_accounts)
      await waitForExpectedText(app, selector.accounts_title, 'Accounts')
      await app.client.click(selector.button_addAccount)
      await waitForExpectedText(app, selector.modal_title, 'Add accounts')
      await app.client.setValue('.select__input input', 'Bitcoin testnet')
      await app.client.keys('Enter')
      expect(selector.currencybadge).toBeNull
      },
    TIMEOUT,
    )
  },
  TIMEOUT,
)
