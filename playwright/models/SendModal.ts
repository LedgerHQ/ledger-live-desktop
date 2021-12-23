import { Page, Locator } from "@playwright/test";
import { Modal } from "./Modal";

export class SendModal extends Modal {
  readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }
}
