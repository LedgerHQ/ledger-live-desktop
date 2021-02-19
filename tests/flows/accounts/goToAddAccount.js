import { portfolioPage, addAccountsModal, accountsPage } from "../../common.js";

const goToAddAccount = async () => {
  const exists = await portfolioPage.isAddAccountAvailable();
  if (!exists) {
    await portfolioPage.goToAccounts();
  }
  const addAccountButton = exists
    ? await portfolioPage.emtpyStateAddAccountButton
    : await accountsPage.addAccountButton;
  await addAccountButton.click();
  await addAccountsModal.waitForDisplayed();
};
export default goToAddAccount;
