import { waitForDisappear, waitForExpectedText } from './helpers'
import { applicationProxy, getConfigPath } from './applicationProxy'
import * as selector from './selectors'

const path = require('path')
const fs = require('fs')

let app

const TIMEOUT = 50 * 1000

const tmpAppJSONPath = path.resolve(getConfigPath(), 'app.json')
const accountsOperations = '"operations":[{'

describe(
  'Start LL after verion update, Release Note, Check password lock',
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
      'Release Note should be displayed',
      async () => {
        await waitForExpectedText(app, selector.modal_title, 'Release notes')
        await app.client.click(selector.button_closeReleaseNote)
      },
      TIMEOUT,
    )

    test(
      'Dashboard: Portfolio should show Graph, Assets, Operations',
      async () => {
        await waitForExpectedText(
          app,
          selector.portfolio_assetDistribution_tile,
          'Asset distribution (',
        )
        const assetDistribution = await app.client.getText(selector.portfolio_operationList_title)
        expect(assetDistribution).toEqual('Last operations')
      },
      TIMEOUT,
    )

    test(
      'Click setting icon -> Check General settings',
      async () => {
        await app.client.click(selector.button_settings)
        await waitForExpectedText(app, selector.settings_title, 'Settings')
        await app.client.click(selector.button_reportBug)
        await app.client.click(selector.button_shareAnalytics)
      },
      TIMEOUT,
    )

    test(
      'Enable password lock should Encrypt user data',
      async () => {
        await app.client.click(selector.button_passwordLock)
        await waitForExpectedText(app, selector.modal_title, 'Password lock')
        await waitForExpectedText(app, selector.setPassword_title, 'Set a password')
        await app.client.setValue(selector.input_newPassword, 5)
        await app.client.setValue(selector.input_confirmPassword, 5)
        await app.client.keys('Enter')
        await waitForExpectedText(app, selector.settings_title, 'Settings')
        await app.client.pause(2000)
        const LockedfileContent = fs.readFileSync(tmpAppJSONPath, 'utf-8')
        await expect(LockedfileContent).not.toContain(accountsOperations)
      },
      TIMEOUT,
    )

    test(
      'Disable password lock should Decrypt user data',
      async () => {
        await app.client.click(selector.button_passwordLock)
        await waitForExpectedText(app, selector.modal_title, 'Disable password lock')
        await app.client.setValue('#password', 5)
        await app.client.pause(500)
        await app.client.keys('Enter')
        await waitForExpectedText(app, selector.settings_title, 'Settings')
        await app.client.pause(3000)
        const UnlockedfileContent = fs.readFileSync(tmpAppJSONPath, 'utf-8')
        await expect(UnlockedfileContent).toContain(accountsOperations)
        await app.client.pause(1000)
      },
      TIMEOUT,
    )
  },
  TIMEOUT,
)
