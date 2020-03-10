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
    expect(await onboardingPage.isVisible()).toBe(true);
    expect(await onboardingPage.logo.isVisible()).toBe(true);
    expect(await onboardingPage.getPageTitle()).toBe("Bienvenue sur Ledger Live");
    expect(await onboardingPage.getPageDescription()).toBe(
      "Commençons par choisir l'apparence de Ledger Live. Vous pouvez changer cela à tout moment dans vos paramètres."
    );
    await onboardingPage.setTheme("dusk");
    expect(await onboardingPage.getThemeColor()).toBe("#182532");
    await onboardingPage.setTheme("dark");
    expect(await onboardingPage.getThemeColor()).toBe("#1c1d1f");
    await onboardingPage.setTheme("light");
    expect(await onboardingPage.getThemeColor()).toBe("#ffffff");
  });

  describe("When I start the onboarding", () => {
    it("should display different options", async () => {
      await onboardingPage.getStarted();
      expect(await onboardingPage.logo.isVisible()).toBe(true);
      expect(await onboardingPage.getPageTitle()).toBe("Premiers pas avec votre appareil Ledger");
      expect(await onboardingPage.newDeviceButton.isVisible()).toBe(true);
      expect(await onboardingPage.restoreDeviceButton.isVisible()).toBe(true);
      expect(await onboardingPage.initializedDeviceButton.isVisible()).toBe(true);
      expect(await onboardingPage.noDeviceButton.isVisible()).toBe(true);
    });

    describe("Setup new device flow", () => {
      it("should allow to setup new device (nanoX)", async () => {
        await onboardingPage.selectConfiguration("new");
        expect(await onboardingPage.getPageTitle()).toBe("Sélectionner votre appareil");
        expect(await onboardingPage.nanoX.isVisible()).toBe(true);
        expect(await onboardingPage.nanoS.isVisible()).toBe(true);
        expect(await onboardingPage.blue.isVisible()).toBe(true);
        await onboardingPage.selectDevice("nanox");
        await onboardingPage.continue();
      });

      it("should help user to setup a new device", async () => {
        expect(await onboardingPage.getPageTitle()).toBe("Choisissez votre code PIN.");
        await onboardingPage.continue();
        expect(await onboardingPage.getPageTitle()).toBe(
          "Enregistrez votre phrase de récupération",
        );
        await onboardingPage.continue();
      });

      it("should ask to fill a security checklist", async () => {
        expect(await onboardingPage.getPageTitle()).toBe("Liste des contrôles de sécurité");
        expect(await onboardingPage.getPageDescription()).toBe(
          "Avant de poursuivre, veuillez compléter la liste des contrôles de sécurité.",
        );
        await onboardingPage.genuineCheckPin("yes");
        await onboardingPage.genuineCheckSeed("yes");
        await onboardingPage.genuineCheck();
      });

      it("should display a modal to perform a genuine check", async () => {
        expect(await modalPage.visible()).toBe(true);
        expect(await modalPage.getTitle()).toBe("Vérification d'authenticité");
        await modalPage.closeButton.click();
      });

      it("should be able to browse to previous steps", async () => {
        await onboardingPage.back();
        expect(await onboardingPage.getPageTitle()).toBe(
          "Enregistrez votre phrase de récupération",
        );
        await onboardingPage.back();
        expect(await onboardingPage.getPageTitle()).toBe("Choisissez votre code PIN.");
        await onboardingPage.back();
        expect(await onboardingPage.getPageTitle()).toBe("Sélectionner votre appareil");
        await onboardingPage.back();
        expect(await onboardingPage.getPageTitle()).toBe("Premiers pas avec votre appareil Ledger");
      });
    });

    describe("Restore device flow", () => {
      it("should allow to restore a device (blue)", async () => {
        await onboardingPage.selectConfiguration("restore");
        expect(await onboardingPage.getPageTitle()).toBe("Sélectionner votre appareil");
        expect(await onboardingPage.nanoX.isVisible()).toBe(true);
        expect(await onboardingPage.nanoS.isVisible()).toBe(true);
        expect(await onboardingPage.blue.isVisible()).toBe(true);
        await onboardingPage.selectDevice("blue");
        await onboardingPage.continue();
      });

      it("should help user to restore a device", async () => {
        expect(await onboardingPage.getPageTitle()).toBe("Choisissez votre code PIN.");
        await onboardingPage.continue();
        expect(await onboardingPage.getPageTitle()).toBe("Saisissez votre phrase de récupération.");
        await onboardingPage.continue();
      });

      it("should ask to fill a security checklist", async () => {
        expect(await onboardingPage.getPageTitle()).toBe("Liste des contrôles de sécurité");
        expect(await onboardingPage.getPageDescription()).toBe(
          "Avant de commencer, veuillez confirmer :",
        );
        await onboardingPage.genuineCheckPin("yes");
        await onboardingPage.genuineCheckSeed("yes");
        await onboardingPage.genuineCheck();
      });

      it("should display a modal to perform a genuine check", async () => {
        expect(await modalPage.visible()).toBe(true);
        expect(await modalPage.getTitle()).toBe("Vérification d'authenticité");
        await modalPage.closeButton.click();
      });

      it("should be able to browse to previous steps", async () => {
        await onboardingPage.back();
        expect(await onboardingPage.getPageTitle()).toBe("Saisissez votre phrase de récupération.");
        await onboardingPage.back();
        expect(await onboardingPage.getPageTitle()).toBe("Choisissez votre code PIN.");
        await onboardingPage.back();
        expect(await onboardingPage.getPageTitle()).toBe("Sélectionner votre appareil");
        await onboardingPage.back();
        expect(await onboardingPage.getPageTitle()).toBe("Premiers pas avec votre appareil Ledger");
      });
    });

    describe("Initialized device flow", () => {
      it("should allow to use an initialized device (nanoS)", async () => {
        await onboardingPage.selectConfiguration("initialized");
        expect(await onboardingPage.getPageTitle()).toBe("Sélectionner votre appareil");
        expect(await onboardingPage.nanoX.isVisible()).toBe(true);
        expect(await onboardingPage.nanoS.isVisible()).toBe(true);
        expect(await onboardingPage.blue.isVisible()).toBe(true);
        await onboardingPage.selectDevice("nanos");
        await onboardingPage.continue();
      });

      describe("When it ask to fill a security checklist", () => {
        it("should fail if PIN not choosen by user", async () => {
          expect(await onboardingPage.getPageTitle()).toBe("Liste des contrôles de sécurité");
          await onboardingPage.genuineCheckPin("no");
          expect(await onboardingPage.getPageTitle()).toBe(
            "Vous n’avez pas choisi votre propre code PIN ?",
          );
          expect(await onboardingPage.getPageDescription()).toBe(
            "N’utilisez jamais un appareil fourni avec un code PIN. En cas de doute, veuillez nous contacter.",
          );
          expect(await onboardingPage.contactUsButton.isVisible()).toBe(true);
          await onboardingPage.back();
        });

        it("should fail if SEED not choosen by user", async () => {
          await onboardingPage.genuineCheckPin("yes");
          await onboardingPage.genuineCheckSeed("no");
          expect(await onboardingPage.getPageTitle()).toBe(
            "Vous n’avez pas enregistré votre phrase de récupération vous-même ?",
          );
          expect(await onboardingPage.getPageDescription()).toBe(
            "Enregistrez seulement une phrase de récupération affichée sur votre appareil et à vous seul. Veuillez nous contacter en cas de doute.",
          );
          expect(await onboardingPage.contactUsButton.isVisible()).toBe(true);
          await onboardingPage.back();
        });

        it("should success if all requirements have been met", async () => {
          expect(await onboardingPage.getPageTitle()).toBe("Liste des contrôles de sécurité");
          await onboardingPage.genuineCheckPin("yes");
          await onboardingPage.genuineCheckSeed("yes");
          await onboardingPage.genuineCheck();
        });

        it("should display a modal to perform a genuine check", async () => {
          expect(await modalPage.visible()).toBe(true);
          expect(await modalPage.getTitle()).toBe("Vérification d'authenticité");
          await modalPage.closeButton.click();
        });

        it("should be able to browse to previous steps", async () => {
          await onboardingPage.back();
          expect(await onboardingPage.getPageTitle()).toBe("Sélectionner votre appareil");
          await onboardingPage.back();
          expect(await onboardingPage.getPageTitle()).toBe(
            "Premiers pas avec votre appareil Ledger",
          );
        });
      });
    });

    describe("No device flow", () => {
      it("should display a menu", async () => {
        await onboardingPage.selectConfiguration("nodevice");
        expect(await onboardingPage.getPageTitle()).toBe("Vous n’avez pas d’appareil Ledger ?");
        expect(await onboardingPage.buyNewButton.isVisible()).toBe(true);
        expect(await onboardingPage.trackOrderButton.isVisible()).toBe(true);
        expect(await onboardingPage.learnMoreButton.isVisible()).toBe(true);
      });

      it("should be able to browse to previous steps", async () => {
        await onboardingPage.back();
        expect(await onboardingPage.getPageTitle()).toBe("Premiers pas avec votre appareil Ledger");
      });
    });
  });
});
