import { applicationProxy } from "../applicationProxy";
import OnboardingPage from "../po/onboarding.page";

describe("When I am on the onboarding,", () => {
  let app;
  let onboardingPage;

  beforeAll(async () => {
    app = applicationProxy();
    await app.start();
    onboardingPage = new OnboardingPage(app);
  });

  afterAll(async () => {
    // await app.stop();
  });

  it("opens a window", () => {
    return app.client
      .waitUntilWindowLoaded()
      .getTitle()
      .then(title => {
        expect(title).toBe("Ledger Live");
      });
  });

  it("should be able to change appearance", async () => {
      await app.client.waitForVisible("#dark")
      await onboardingPage.getStarted();
      await onboardingPage.setAppearance("dark");
    // expect(onboardingPage.appearance).toBe("#1C1D1F");
  });
});
