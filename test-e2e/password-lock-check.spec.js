import { waitForDisappear, waitForExpectedText } from './helpers'
import { applicationProxy, getConfigPath } from './applicationProxy'
import * as selector from './selectors'

const path = require('path')
const fs = require('fs')

const { toMatchImageSnapshot } = require('jest-image-snapshot')

expect.extend({ toMatchImageSnapshot })

let app

const TIMEOUT = 50 * 1000

const tmpAppJSONPath = path.resolve(getConfigPath(), 'app.json')
const accountsOperations = '"operations":[{'

const getPath = name => {
  const screenshotPath = path.resolve(__dirname, 'data/screenshots')
  return `${screenshotPath}/${name}.png`
}

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
      'Terms of use modal should be displayed',
      async () => {
        const titleModal = await app.client.getText(selector.modal_title)
        expect(titleModal[1]).toEqual('Terms of Use')
        let image = await app.client.saveScreenshot(getPath('termsOfUse_off'))
        expect(image).toMatchImageSnapshot({
          failureThreshold: 0.05,
          failureThresholdType: 'percent'
        })
        expect(await app.client.isEnabled(selector.button_continue)).toEqual(false)
        await app.client.click(selector.checkbox_termsOfUse)

        await app.client.pause(1000)
        image = await app.client.saveScreenshot(getPath('termsOfUse_on'))
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

    test(
      'Release Note should be displayed',
      async () => {
        await waitForExpectedText(app, selector.modal_title, 'Release notes')
        const image = await app.client.saveScreenshot(getPath('releaseNote'))
        expect(image).toMatchImageSnapshot({
          failureThreshold: 0.05,
          failureThresholdType: 'percent'
        })
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
          'Asset allocation (',
        )
        const lastOperations = await app.client.getText(selector.portfolio_operationList_title)
        expect(lastOperations).toEqual('Last operations')
        await app.client.pause(3000)
        const image = await app.client.saveScreenshot(getPath('portfolio'))
        expect(image).toMatchImageSnapshot({
          failureThreshold: 0.05,
          failureThresholdType: 'percent'
        })
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
        const image = await app.client.saveScreenshot(getPath('generalSettings'))
        expect(image).toMatchImageSnapshot({
          failureThreshold: 0.02,
          failureThresholdType: 'percent'
        })
      },
      TIMEOUT,
    )

    test(
      'Enable password lock should Encrypt user data',
      async () => {
        await app.client.click(selector.button_passwordLock)
        await waitForExpectedText(app, selector.modal_title, 'Password lock')
        await waitForExpectedText(app, selector.setPassword_title, 'Set a password')
        let image = await app.client.saveScreenshot(getPath('setPassword'))
        expect(image).toMatchImageSnapshot({
          failureThreshold: 0.02,
          failureThresholdType: 'percent'
        })

        await app.client.setValue(selector.input_newPassword, 5)
        await app.client.setValue(selector.input_confirmPassword, 5)
        await app.client.keys('Enter')
        await waitForExpectedText(app, selector.settings_title, 'Settings')
        await app.client.pause(1000)
        image = await app.client.saveScreenshot(getPath('generalSettings_passwordOn'))
        expect(image).toMatchImageSnapshot({
          failureThreshold: 0.02,
          failureThresholdType: 'percent'
        })
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
        const image = await app.client.saveScreenshot(getPath('disablePassword'))
        expect(image).toMatchImageSnapshot({
          failureThreshold: 0.05,
          failureThresholdType: 'percent'
        })
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
