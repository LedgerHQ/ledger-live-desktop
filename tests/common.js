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

export default function initialize({ userData, env = {} }) {
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
    } catch (e) {
      console.log("app start error", e);
    }

    app.client.addCommand("screenshot", function(countdown = 500) {
      this.pause(countdown);

      return this.browserWindow.capturePage();
    });
  });

  afterAll(async () => {
    return app.stop().then(() => removeUserData());
  });
}

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
