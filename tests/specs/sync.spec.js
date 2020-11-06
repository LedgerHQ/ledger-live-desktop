import { applicationProxy, removeUserData } from "../applicationProxy";
import data from "../data/onboarding/";

jest.setTimeout(60000);

describe("When I launch the app for the first time", () => {
  let app;

  beforeAll(() => {
    app = applicationProxy("btcFamily", { MOCK: true, DISABLE_MOCK_POINTER_EVENTS: true });

    return app.start();
  });

  afterAll(() => {
    return app.stop().then(() => removeUserData());
  });

  it("opens a window", () => {
    return app.client
      .waitUntilWindowLoaded()
      .getWindowCount()
      .then(count => expect(count).toBe(1))
      .browserWindow.isMinimized()
      .then(minimized => expect(minimized).toBe(false))
      .browserWindow.isDisplayed()
      .then(visible => expect(visible).toBe(true))
      .browserWindow.isFocused()
      .then(focused => expect(focused).toBe(true))
      .getTitle()
      .then(title => {
        expect(title).toBe(data.appTitle);
      });
  });

  // eslint-disable-next-line jest/expect-expect
  it("should be synchronizing all accounts", () => {
    // TODO: Assert synchronization

    return app.client.pause(10000);
  });
});
