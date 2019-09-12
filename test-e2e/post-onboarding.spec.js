import { waitForDisappear, waitForExpectedText } from './helpers'

import { applicationProxy } from './applicationProxy'

let app

const TIMEOUT = 50 * 1000

describe('Application launch', () => {
  beforeEach(async () => {
    app = applicationProxy(null, {SKIP_ONBOARDING: '1'})
    await app.start()
  }, TIMEOUT)

/*  afterEach(async () => {
    if (app && app.isRunning()) {
      await app.stop()
    }
  }, TIMEOUT)
*/
  test(
    'Start app',
    async () => {
    const title = await app.client.getTitle()
      expect(title).toEqual('Ledger Live')
      await app.client.waitUntilWindowLoaded()
      await waitForDisappear(app, '#preload')

      // Post Onboarding (Analytics)
      await waitForExpectedText(app, '[data-e2e=onboarding_title]', 'Bugs and analytics')

      // Verify "Technical Data" + Link "Learn more"
      const analytics_techData_title = await app.client.getText('[data-e2e=analytics_techData]')
      expect(analytics_techData_title).toEqual('Technical data*')
      await app.client.click('[data-e2e=analytics_techData_Link]')
      await waitForExpectedText(app, '[data-e2e=modalTitle]', 'Technical data')
      await app.client.click('[data-e2e=modal_buttonClose_techData]')

      // Verify "Analytics" + Link "Learn more"
      const analytics_shareAnalytics_title = await app.client.getText(
        '[data-e2e=analytics_shareAnalytics]',
      )
      expect(analytics_shareAnalytics_title).toEqual('Analytics')
      await app.client.click('[data-e2e=analytics_shareAnalytics_Link]')
      await waitForExpectedText(app, '[data-e2e=modalTitle]', 'Analytics')
      await app.client.click('[data-e2e=modal_buttonClose_shareAnalytics]')

      // Verify "Report bugs"
      const analytics_reportBugs_title = await app.client.getText('[data-e2e=analytics_reportBugs]')
      expect(analytics_reportBugs_title).toEqual('Bug reports')

      await app.client.click('[data-e2e=continue_button]')

      // Finish Onboarding
      await waitForExpectedText(app, '[data-e2e=finish_title]', 'Your device is ready!')
      await app.client.click('[data-e2e=continue_button]')

      await waitForExpectedText(app, '[data-e2e=modalTitle]', 'Trade safely')
      await app.client.click('[data-e2e=continue_button]')

      // Dashboard EmptyState
      await waitForExpectedText(
        app,
        '[data-e2e=dashboard_empty_title]',
        'Install apps or add accounts',
      )
      const openManager_button = await app.client.getText('[data-e2e=dashboard_empty_OpenManager]')
      expect(openManager_button).toEqual('Open Manager')
      const addAccount_button = await app.client.getText('[data-e2e=dashboard_empty_AddAccounts]')
      expect(addAccount_button).toEqual('Add accounts')
    },
    TIMEOUT,
  )
})