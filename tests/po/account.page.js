import Page from "./page";

export default class AccountPage extends Page {
  get settingsButton() {
    return this.$("#account-settings-button");
  }

  get accountHeaderName() {
    return this.$("#account-header-name");
  }

  get starButton() {
    return this.$("#account-star-button");
  }

  get tokensList() {
    return this.$("#tokens-list");
  }

  get menuHideTokenButton() {
    return this.$("#token-menu-hide");
  }

  async bookmarkAccount() {
    const elem = await this.starButton;
    await elem.click();
  }

  async getTokens() {
    const list = await this.tokensList;
    return list.$$(".token-row");
  }

  async hideFirstToken() {
    const tokens = await this.getTokens();
    const [token] = tokens;
    await token.click({ button: "right" });
    await this.app.client.pause(500);
    const hideButton = await this.menuHideTokenButton;
    await hideButton.click();
  }
}
