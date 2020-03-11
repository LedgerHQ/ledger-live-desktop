import { waitForExpectedText } from "../helpers.js";
import { applicationProxy, getScreenshotPath } from "../applicationProxy";
import * as selector from "../selectors.js";
import * as step from "../scenarios.js";

const { toMatchImageSnapshot } = require("jest-image-snapshot");

expect.extend({ toMatchImageSnapshot });

let app;

const TIMEOUT = 50 * 1000;

describe("Launch LL with empty user data, Skip onboarding, Welcome steps, check Empty state", () => {
  beforeAll(async () => {
    app = applicationProxy("empty.json", { SKIP_ONBOARDING: "1" });
    await app.start();
  }, TIMEOUT);

  afterAll(async () => {
    if (app && app.isRunning()) {
      await app.stop();
    }
  }, TIMEOUT);

  test(
    "Launch app, Analytics infos should be displayed",
    async () => {
      await step.applicationStart(app);
      await waitForExpectedText(app, selector.onboarding_title, "Bugs and analytics");
      const image = await app.client.saveScreenshot(getScreenshotPath("bugAnalytics"));
      expect(image).toMatchImageSnapshot({
        failureThreshold: 0.05,
        failureThresholdType: "percent",
      });
    },
    TIMEOUT,
  );

  test(
    "Technical data infos should be displayed",
    async () => {
      const analytics_techData_title = await app.client.getText(selector.analytics_techData);
      expect(analytics_techData_title).toEqual("Technical data*");
      await app.client.click(selector.techData_link);
      await waitForExpectedText(app, selector.modal_title, "Technical data");
      const image = await app.client.saveScreenshot(getScreenshotPath("techData"));
      expect(image).toMatchImageSnapshot({
        failureThreshold: 0.05,
        failureThresholdType: "percent",
      });
      await app.client.click(selector.button_closeTechdata);
    },
    TIMEOUT,
  );

  test(
    "Share Analytics infos should be displayed",
    async () => {
      const analytics_shareAnalytics_title = await app.client.getText(
        selector.analytics_shareAnalytics,
      );
      expect(analytics_shareAnalytics_title).toEqual("Analytics");
      await app.client.click(selector.shareAnalytics_link);
      await waitForExpectedText(app, selector.modal_title, "Analytics");
      const image = await app.client.saveScreenshot(getScreenshotPath("analytics"));
      expect(image).toMatchImageSnapshot();
      await app.client.click(selector.button_closeShareAnalytics);
    },
    TIMEOUT,
  );

  test(
    "Report bugs infos should be displayed",
    async () => {
      const analytics_reportBugs_title = await app.client.getText(selector.analytics_reportBugs);
      expect(analytics_reportBugs_title).toEqual("Bug reports");
    },
    TIMEOUT,
  );

  test(
    "Your device is ready then Terms of Use modals should be displayed",
    async () => {
      await app.client.click(selector.button_continue);
      await waitForExpectedText(app, selector.onboarding_finish_title, "Your device is ready!");
      await app.client.pause(1000);
      const image = await app.client.saveScreenshot(getScreenshotPath("deviceReady"));
      expect(image).toMatchImageSnapshot({
        failureThreshold: 0.05,
        failureThresholdType: "percent",
      });
      await app.client.click(selector.button_continue);
      await step.termsOfUse(app);
    },
    TIMEOUT,
  );

  test(
    "Dashboard empty state should show Add account and Manager buttons",
    async () => {
      await waitForExpectedText(
        app,
        "[data-e2e=dashboard_empty_title]",
        "Install apps or add accounts",
      );
      await app.client.pause(2000);
      const image = await app.client.saveScreenshot(getScreenshotPath("emptyDashboard"));
      expect(image).toMatchImageSnapshot({
        failureThreshold: 0.02,
        failureThresholdType: "percent",
      });
      const openManager_button = await app.client.getText(selector.button_openManager);
      expect(openManager_button).toEqual("Open Manager");
      const addAccount_button = await app.client.getText(selector.button_emptyAddAccount);
      expect(addAccount_button).toEqual("Add accounts");
    },
    TIMEOUT,
  );
});
