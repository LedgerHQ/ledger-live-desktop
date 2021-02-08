import Modal from "./modal.page";

export default class SendModal extends Modal {
  get continueButton() {
    return this.$("#send-recipient-continue-button");
  }
}
