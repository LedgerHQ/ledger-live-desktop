const Application = require('spectron').Application

let app

const TIMEOUT = 50 * 1000

describe('Application launch', () => {
  beforeEach(async () => {
    app = new Application({
      path: './dist/ledger-live-desktop-1.1.0-linux-x86_64.AppImage',
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
    'Start app and set developper mode ',
    async () => {
      const title = await app.client.getTitle()
      expect(title).toEqual('Ledger Live')
      await app.client.waitUntilWindowLoaded()
      await app.client.pause(2000)

      // Post Onboarding
      const title_onboarding = await app.client.getText('[data-e2e=onboarding_title]')
      expect(title_onboarding).toEqual('Analytics and bug reports')
      await app.client.click('[data-e2e=continue_button]')
      await app.client.pause(1000)

      const title_finish = await app.client.getText('[data-e2e=finish_title]')
      expect(title_finish).toEqual('Your device is ready!')
      await app.client.click('[data-e2e=continue_button]')
      await app.client.pause(1000)

      const title_disclaimer = await app.client.getText('[data-e2e=disclaimer_title]')
      expect(title_disclaimer).toEqual('Trade safely')
      await app.client.click('[data-e2e=continue_button]')
      await app.client.pause(1000)

      // Dashboard EmptyState
      const title_dashboard_empty = await app.client.getText('[data-e2e=dashboard_empty_title]')
      expect(title_dashboard_empty).toEqual('Add accounts to your portfolio')

      // Open Settings
      await app.client.click('[data-e2e=setting_button]')
      await app.client.pause(1000)
      const title_settings = await app.client.getText('[data-e2e=settings_title]')
      expect(title_settings).toEqual('Settings')

      // DevMode ON
      await app.client.click('[data-e2e=devMode_button]')
      await app.client.pause(500)
    },
    TIMEOUT,
  )
})
