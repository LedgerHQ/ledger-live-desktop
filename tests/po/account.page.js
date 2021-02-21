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

  get operationsList() {
    return this.$("#operation-list");
  }

  async bookmarkAccount() {
    const elem = await this.starButton;
    await elem.click();
  }

  async getTokens() {
    const list = await this.tokensList;
    return list.$$(".token-row");
  }

  async getOperationRows() {
    const operationList = await this.operationsList;
    return operationList.$$(".operation-row");
  }

  async hideFirstToken() {
    const tokens = await this.getTokens();
    const [token] = tokens;
    await token.click({ button: "right" });
    const hideButton = await this.menuHideTokenButton;
    await hideButton.click();
  }

  async clickFirstOperationRow() {
    const operationRows = await this.getOperationRows();

    const firstOperationRow = operationRows[0];
    await firstOperationRow.click();
  }
}
