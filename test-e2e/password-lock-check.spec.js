import { waitForDisappear, waitForExpectedText } from './helpers'
import { applicationProxy, getConfigPath } from './applicationProxy'

const path = require('path')
const fs = require('fs')

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
    'Start app, activate password lock, check app.json, deactivate password lock',
    async () => {
      const title = await app.client.getTitle()
      expect(title).toEqual('Ledger Live')
      await app.client.waitUntilWindowLoaded()
      await waitForDisappear(app, '#preload')
      // Verify Account summary text
/*       
      // Count user's accounts
      const userAccountsList = await app.client.elements('[data-e2e=dashboard_AccountCardWrapper]')
      const userAccountsCount = Object.keys(userAccountsList.value).length
      // Check account number
      const accountSummary = await app.client.getText('[data-e2e=dashboard_accountsSummaryDesc]')
      const accountSummaryMessage = `Here's the summary of your ${userAccountsCount} accounts`
      expect(accountSummary).toEqual(accountSummaryMessage)
*/
      // Go to settings
      await app.client.click('[data-e2e=setting_button]')
      await waitForExpectedText(app, '[data-e2e=settings_title]', 'Settings')

      // Enable lock password
      await app.client.click('[data-e2e=passwordLock_button]')
      await waitForExpectedText(app, '[data-e2e=modalTitle]', 'Password lock')
      await waitForExpectedText(app, '[data-e2e=setPassword_modalTitle]', 'Set a password')
      await app.client.setValue('[data-e2e=setPassword_NewPassword]', 5)
      await app.client.setValue('[data-e2e=setPassword_ConfirmPassword]', 5)
      await app.client.keys('Enter')
      await waitForExpectedText(app, '[data-e2e=settings_title]', 'Settings')
      await app.client.pause(2000)
      // Verify in app.json that accounts data are encrypted
      const tmpAppJSONPath = path.resolve(getConfigPath(), 'app.json')
      const LockedfileContent = fs.readFileSync(tmpAppJSONPath, 'utf-8')
      const accountsOperations = '"operations":[{'
      await expect(LockedfileContent).not.toContain(accountsOperations)

      // Disable password lock
      await app.client.click('[data-e2e=passwordLock_button]')
      await waitForExpectedText(app, '[data-e2e=modalTitle]', 'Disable password lock')
      await app.client.setValue('#password', 5)
      await app.client.pause(500)
      await app.client.keys('Enter')
      await waitForExpectedText(app, '[data-e2e=settings_title]', 'Settings')
      await app.client.pause(3000)
      const UnlockedfileContent = fs.readFileSync(tmpAppJSONPath, 'utf-8')
      // Verify in app.json that accounts data are not encrypted
      await expect(UnlockedfileContent).toContain(accountsOperations)
      await app.client.pause(1000)
    },
    TIMEOUT,
  )
})
