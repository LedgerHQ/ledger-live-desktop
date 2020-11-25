import {
  deviceInfo155 as deviceInfo,
  mockListAppsResult,
} from "@ledgerhq/live-common/lib/apps/mock";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { applicationProxy, removeUserData, getMockDeviceEvent } from "./applicationProxy";
import OnboardingPage from "./po/onboarding.page";
import ModalPage from "./po/modal.page";
import GenuinePage from "./po/genuine.page";
import PasswordPage from "./po/password.page";
import AnalyticsPage from "./po/analytics.page";
import PortfolioPage from "./po/portfolio.page";
import LockscreenPage from "./po/lockscreen.page";

let app;
let onboardingPage;
let modalPage;
let genuinePage;
let passwordPage;
let analyticsPage;
let portfolioPage;
let lockscreenPage;
let mockDeviceEvent;

expect.extend({ toMatchImageSnapshot });
jest.setTimeout(600000);

// eslint-disable-next-line jest/no-export
export default function initialize(name, { userData, env = {}, disableStartSnap = false }) {
  beforeAll(async () => {
    app = await applicationProxy(userData, env);
    onboardingPage = new OnboardingPage(app);
    modalPage = new ModalPage(app);
    genuinePage = new GenuinePage(app);
    passwordPage = new PasswordPage(app);
    analyticsPage = new AnalyticsPage(app);
    portfolioPage = new PortfolioPage(app);
    lockscreenPage = new LockscreenPage(app);
    mockDeviceEvent = getMockDeviceEvent(app);

    try {
      await app.start();
      await app.client.waitUntilWindowLoaded();
    } catch (e) {
      console.log("app start error", e);
    }

    app.client.addCommand("waitForSync", async () => {
      const sync = await app.client.$("#topbar-synchronized");
      await sync.waitForDisplayed();
    });

    app.client.addCommand("screenshot", function(countdown = 500) {
      this.pause(countdown);

      return this.browserWindow.capturePage();
    });
  });

  afterAll(async () => {
    return app.stop().then(() => removeUserData());
  });

  if (!disableStartSnap) {
    it("should start in this state", async () => {
      await app.client.$("__app__ready__");
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `__start__${name}`,
      });
    });
  }
}

// eslint-disable-next-line jest/no-export
export {
  app,
  deviceInfo,
  mockListAppsResult,
  mockDeviceEvent,
  onboardingPage,
  modalPage,
  genuinePage,
  passwordPage,
  analyticsPage,
  portfolioPage,
  lockscreenPage,
};
