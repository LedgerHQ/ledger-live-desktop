import Page from "./page";

export default class AccountPage extends Page {
  async settingsButton() {
    return this.$("#account-settings-button");
  }

  async accountHeaderName() {
    return this.$("#account-header-name");
  }

  async starButton() {
    return this.$("#account-star-button");
  }

  async tokensList() {
    return this.$("#tokens-list");
  }

  async menuHideTokenButton() {
    return this.$("#token-menu-hide");
  }

  async operationsList() {
    return this.$("#operation-list");
  }

  async actionsDropdown() {
    return this.$("#account-actions-dropdown");
  }

  async actionsDropdownWC() {
    return this.$("#account-actions-dropdown-WalletConnect");
  }

  async bookmarkAccount() {
    const elem = await this.starButton();
    await elem.click();
  }

  async openWalletConnect() {
    const elem = await this.actionsDropdown();
    await elem.click();
    const elem2 = await this.actionsDropdownWC();
    await elem2.click();
  }

  async getTokens() {
    const list = await this.tokensList();
    return list.$$(".token-row");
  }

  async getOperationRows() {
    const operationList = await this.operationsList();
    return operationList.$$(".operation-row");
  }

  async hideFirstToken() {
    const tokens = await this.getTokens();
    const [token] = tokens;
    await token.click({ button: "right" });
    await this.app.client.pause(500);
    const hideButton = await this.menuHideTokenButton();
    await hideButton.click();
  }

  async clickFirstOperationRow() {
    const operationRows = await this.getOperationRows();

    const firstOperationRow = operationRows[0];
    await firstOperationRow.click();
  }
}
