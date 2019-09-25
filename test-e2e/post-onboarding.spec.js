import { waitForDisappear, waitForExpectedText } from './helpers'
import { applicationProxy } from './applicationProxy'
import * as selector from './selectors'

let app

const TIMEOUT = 50 * 1000

describe('Launch LL with empty user data, Skip onboarding, Welcome steps, check Empty state', () => {
  beforeAll(async () => {
    app = applicationProxy(null, { SKIP_ONBOARDING: '1' })
    await app.start()
  }, TIMEOUT)

  afterAll(async () => {
    if (app && app.isRunning()) {
      await app.stop()
    }
  }, TIMEOUT)

  test(
    'Launch app, Analytics infos should be displayed',
    async () => {
      const title = await app.client.getTitle()
      expect(title).toEqual('Ledger Live')
      await app.client.waitUntilWindowLoaded()
      await waitForDisappear(app, '#preload')
      await waitForExpectedText(app, selector.onboarding_title, 'Bugs and analytics')
    },
    TIMEOUT,
  )

  test(
    'Technical data infos should be displayed',
    async () => {
      const analytics_techData_title = await app.client.getText(selector.analytics_techData)
      expect(analytics_techData_title).toEqual('Technical data*')
      await app.client.click(selector.techData_link)
      await waitForExpectedText(app, selector.modal_title, 'Technical data')
      await app.client.click(selector.button_closeTechdata)
    },
    TIMEOUT,
  )

  test(
    'Share Analytics infos should be displayed',
    async () => {
      const analytics_shareAnalytics_title = await app.client.getText(
        selector.analytics_shareAnalytics,
      )
      expect(analytics_shareAnalytics_title).toEqual('Analytics')
      await app.client.click(selector.shareAnalytics_link)
      await waitForExpectedText(app, selector.modal_title, 'Analytics')
      await app.client.click(selector.button_closeShareAnalytics)
    },
    TIMEOUT,
  )

  test(
    'Report bugs infos should be displayed',
    async () => {
      const analytics_reportBugs_title = await app.client.getText(selector.analytics_reportBugs)
      expect(analytics_reportBugs_title).toEqual('Bug reports')
    },
    TIMEOUT,
  )

  test(
    'Your device is ready then tradesafely modals should be displayed',
    async () => {
      await app.client.click(selector.button_continue)
      await waitForExpectedText(app, selector.onboarding_finish_title, 'Your device is ready!')
      await app.client.click(selector.button_continue)
      await waitForExpectedText(app, selector.modal_title, 'Trade safely')
      await app.client.click(selector.button_continue)
    },
    TIMEOUT,
  )

  test(
    'Dashboard empty state should show Add account and Manager buttons',
    async () => {
      await waitForExpectedText(
        app,
        '[data-e2e=dashboard_empty_title]',
        'Install apps or add accounts',
      )
      const openManager_button = await app.client.getText(selector.button_openManager)
      expect(openManager_button).toEqual('Open Manager')
      const addAccount_button = await app.client.getText(selector.button_addAccount)
      expect(addAccount_button).toEqual('Add accounts')
    },
    TIMEOUT,
  )
})
