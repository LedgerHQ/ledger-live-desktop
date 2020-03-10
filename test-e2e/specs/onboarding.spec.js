import { applicationProxy } from "../applicationProxy";
import OnboardingPage from "../po/onboarding.page";
import ModalPage from "../po/modal.page";

describe("When I launch the app for the first time", () => {
  let app;
  let onboardingPage;
  let modalPage;

  beforeAll(async () => {
    app = applicationProxy();
    await app.start();
    onboardingPage = new OnboardingPage(app);
    modalPage = new ModalPage(app);
  });

  afterAll(async () => {
    await app.stop();
  });

  it("opens a window", () => {
    return app.client
      .waitUntilWindowLoaded()
      .getTitle()
      .then(title => {
        expect(title).toBe("Ledger Live");
      });
  });

  it("should be able to change theme", async () => {
    expect(await onboardingPage.visible()).toBe(true);
    expect(await onboardingPage.logo.isVisible()).toBe(true);
    expect(await onboardingPage.getPageTitle()).toBe("Bienvenue sur Ledger Live");
    await onboardingPage.setTheme("dusk");
    expect(await onboardingPage.getTheme()).toBe("#182532");
    await onboardingPage.setTheme("dark");
    expect(await onboardingPage.getTheme()).toBe("#1c1d1f");
    await onboardingPage.setTheme("light");
    expect(await onboardingPage.getTheme()).toBe("#ffffff");
  });

  describe("When I start the onboarding", () => {
    it("should display different menus", async () => {
      await onboardingPage.getStarted();
      expect(await onboardingPage.getPageTitle()).toBe("Premiers pas avec votre appareil Ledger");
    });

    it("should allow to setup new device", async () => {
      await onboardingPage.selectConfiguration("new");
      expect(await onboardingPage.getPageTitle()).toBe("Sélectionner votre appareil");
      await onboardingPage.selectDevice("nanox");
      await onboardingPage.continue();
      await onboardingPage.back();
      await onboardingPage.back();
    });

    it("should allow to restore a device", async () => {
      await onboardingPage.selectConfiguration("restore");
      expect(await onboardingPage.getPageTitle()).toBe("Sélectionner votre appareil");
      await onboardingPage.selectDevice("nanox");
      await onboardingPage.continue();
      await onboardingPage.back();
      await onboardingPage.back();
    });

    it("should allow to buy a device", async () => {
      await onboardingPage.selectConfiguration("nodevice");
      expect(await onboardingPage.getPageTitle()).toBe("Vous n’avez pas d’appareil Ledger ?");
      await onboardingPage.back();
    });

    it("should allow to use an initialized device", async () => {
      await onboardingPage.selectConfiguration("initialized");
      expect(await onboardingPage.getPageTitle()).toBe("Sélectionner votre appareil");
      await onboardingPage.selectDevice("nanox");
      await onboardingPage.continue();
      expect(await onboardingPage.getPageTitle()).toBe("Liste des contrôles de sécurité");
      await onboardingPage.genuineCheckPin("yes");
      await onboardingPage.genuineCheckSeed("yes");
      await onboardingPage.genuineCheck();
      expect(await modalPage.visible()).toBe(true);
      expect(await modalPage.getTitle()).toBe("Vérification d'authenticité");
      await modalPage.closeButton.click();
    });
  });
});
