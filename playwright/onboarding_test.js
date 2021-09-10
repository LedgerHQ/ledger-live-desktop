Feature("onboarding");

Scenario("Onboarding", async ({ I }) => {
  await I.waitForNavigation();
  await I.waitForVisible("#onboarding-get-started-button", 5);
  I.saveScreenshot("before.png");
  await I.click("#onboarding-get-started-button");
  await I.saveScreenshot("after.png");
});
