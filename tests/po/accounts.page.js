import Page from "./page";

// type SortType = "highestBalance" | "lowestBalance" | "AZ" | "ZA";

export default class AccountsPage extends Page {
  get searchBoxInput() {
    return this.$("#accounts-search-input");
  }

  get sortSelectButton() {
    return this.$("#accounts-order-select-button");
  }

  get sortHighestBalanceButton() {
    return this.$("#accounts-order-select-balance-desc");
  }

  get sortLowestBalanceButton() {
    return this.$("#accounts-order-select-balance-asc");
  }

  get sortNameAscButton() {
    return this.$("#accounts-order-select-name-asc");
  }

  get sortNameDescButton() {
    return this.$("#accounts-order-select-name-desc");
  }

  get accountsList() {
    return this.$("#accounts-list");
  }

  get addAccountButton() {
    return this.$("#accounts-add-account-button");
  }

  get displayGridButton() {
    return this.$("#accounts-display-grid");
  }

  get displayListButton() {
    return this.$("#accounts-display-list");
  }

  get optionsButton() {
    return this.$("#accounts-options-button");
  }

  get exportAccountsButton() {
    return this.$("#accounts-button-exportAccounts");
  }

  get exportOperationsHistoryButton() {
    return this.$("#accounts-button-exportOperations");
  }

  get exportOperationsHistorySaveButton() {
    return this.$("#export-operations-save-button");
  }

  async changeAccountsDisplay(type) {
    const elem = type === "grid" ? await this.displayGridButton : await this.displayListButton;
    await elem.click();
  }

  async getAccountsRows() {
    const list = await this.accountsList;
    return list.$$(".accounts-account-row-item");
  }

  async getFirstAccountRow() {
    const accounts = await this.getAccountsRows();
    return accounts[0];
  }

  async getAccountsWithToken() {
    const list = await this.accountsList;
    return list.$$(".accounts-account-row-item.has-tokens");
  }

  async getFirstAccountWithToken() {
    const accounts = await this.getAccountsWithToken();
    return accounts[0];
  }

  async clickOnAccountRow(accountRow) {
    const content = await accountRow.$(".accounts-account-row-item-content");
    return content.click();
  }

  async selectSortType(type) {
    if (type === "highestBalance") return this.sortHighestBalanceButton;
    if (type === "lowestBalance") return this.sortLowestBalanceButton;
    if (type === "AZ") return this.sortNameAscButton;
    if (type === "ZA") return this.sortNameDescButton;
  }

  async sortAccounts(type) {
    const btn = await this.sortSelectButton;
    await btn.click();

    const order = await this.selectSortType(type);
    await order.click();
  }

  async exportAccountsToMobile() {
    const options = await this.optionsButton;
    await options.click();

    const btn = await this.exportAccountsButton;
    await btn.click();
  }

  async exportOperationsHistory() {
    const options = await this.optionsButton;
    await options.click();

    const btn = await this.exportOperationsHistoryButton;
    await btn.click();
  }

  async searchAccount(searchQuery) {
    const searchBox = await this.searchBoxInput;
    await searchBox.setValue(searchQuery);
  }
}
