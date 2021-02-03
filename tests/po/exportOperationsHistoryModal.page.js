import Modal from "./modal.page";

export default class ExportOperationsHistoryModal extends Modal {
  get accountList() {
    return this.$("#accounts-list-selectable");
  }

  async getAccountsRows() {
    const list = await this.accountList;
    return list.$$(".account-row");
  }
}
