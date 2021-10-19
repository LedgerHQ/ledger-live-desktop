import initialize, { app } from "../common.js";

describe("Swap", () => {
  initialize(
    "swap",
    {
      userData: "1AccountBTC1AccountETH",
    },
    { SPECTRON_RUN_DISABLE_COUNTDOWN_TIMERS: true },
  );

  const $ = selector => app.client.$(selector);

  it("access the feature", async () => {
    const elem = await $("#drawer-swap-button");
    await elem.click();
    await app.client.waitForSync();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "swap-providers", // NB no longer providers but ci doesnt want a name change
    });
  });
});
