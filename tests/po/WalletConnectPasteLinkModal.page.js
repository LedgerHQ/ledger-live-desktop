import Modal from "./modal.page";

export default class WalletConnectPasteLinkModal extends Modal {
  async wcPasteLink() {
    return this.$("#wc-paste-link");
  }

  async wcPasteLinkContinue() {
    return this.$("#wc-paste-link-continue");
  }

  async wcPasteLinkConfirmContinue() {
    return this.$("#wc-paste-link-confirm-continue");
  }

  async pasteLink(link) {
    const input = await this.wcPasteLink();
    await input.waitForDisplayed();
    await input.addValue(link);
  }

  async continue() {
    const btn = await this.wcPasteLinkContinue();
    await btn.click();
  }

  async confirmContinue() {
    const btn = await this.wcPasteLinkConfirmContinue();
    await btn.click();
  }
}
