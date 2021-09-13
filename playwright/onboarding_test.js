Feature("onboarding");

Scenario("Onboarding", async ({ I }) => {
  I.waitForNavigation();
  I.waitForVisible("#onboarding-get-started-button", 5);
  I.saveScreenshot("onboarding_welcome.png");
  I.seeVisualDiff("onboarding_welcome.png");
  I.click("#onboarding-get-started-button");
  I.saveScreenshot("onboarding_legal.png");
  I.seeVisualDiff("onboarding_legal.png");
  I.click("#onboarding-terms-check");
  I.click("#onboarding-terms-submit");
  I.saveScreenshot("onboaring_deviceSelect.png");
  I.seeVisualDiff("onboaring_deviceSelect.png");
  I.click("#device-nanoX");
  I.click("#initialized-device");
  I.saveScreenshot("onboaring_genuineCheck.png");
  I.seeVisualDiff("onboaring_genuineCheck.png");
  I.see("Genuine check");
  I.see("Check my Nano", "#pair-my-nano-cta");
});
