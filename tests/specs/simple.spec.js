import { applicationProxy } from "../applicationProxy";

describe("quick test", () => {
  let app;

  jest.setTimeout(20000);

  beforeAll(async () => {
    app = applicationProxy();
    await app.start();
  });

  afterAll(async () => {
    if (app && app.isRunning()) {
      await app.stop();
    }
  });

  it("should get the title", () => {
    console.log(app.client);
    return app.client
      .waitUntilWindowLoaded()
      .getTitle()
      .then(title => {
        expect(title).toBe("Ledger Live");
      });
  });
});
