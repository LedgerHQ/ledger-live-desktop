import initialize, {
  accountsPage,
  accountPage,
  app,
  walletConnectPasteLinkModal,
  wcClientMock,
  wcConnectedPage,
} from "../common.js";

describe("WalletConnect", () => {
  initialize("walletconnect", {
    userData: "1AccountBTC1AccountETH",
  });

  const $ = selector => app.client.$(selector);

  it("goes to walletconnect modal", async () => {
    await accountsPage.goToAccounts();
    const firstAccountRow = await accountsPage.getNthAccountRow(2);
    await accountsPage.clickOnAccountRow(firstAccountRow);
    await accountPage.openWalletConnect();

    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "wc-connect",
    });
  });

  it("goes to session confirmation", async () => {
    await walletConnectPasteLinkModal.pasteLink("coucou");
    await walletConnectPasteLinkModal.continue();

    wcClientMock("requestSession", []);

    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "wc-connect-confirmation",
    });
  });

  it("confirms session and connect", async () => {
    await walletConnectPasteLinkModal.confirmContinue();

    await wcConnectedPage.waitForConnected();

    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "wc-connect-connected",
    });
  });

  it("disconnects", async () => {
    await wcConnectedPage.disconnect();

    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "wc-connect-end",
    });
  });
});
