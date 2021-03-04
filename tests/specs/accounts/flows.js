/* eslint-disable jest/no-export */
import sortAccounts from "../../flows/accounts/sortAccounts";
import rangeAndDisplay from "../../flows/accounts/rangeAndDisplay";
import editAccountName from "../../flows/accounts/editAccountName";
import bookmarkAccount from "../../flows/accounts/bookmarkAccount";
import exportAccountsToMobile from "../../flows/accounts/exportAccountsToMobile";
import exportOperationsHistory from "../../flows/accounts/exportOperationsHistory";
import hideToken from "../../flows/accounts/hideToken";
import removeAccount from "../../flows/accounts/removeAccount";
import showOperations from "../../flows/accounts/showOperations";

export const globalAccountsFlows = (hasStarredAccounts = false) => {
  sortAccounts();
  rangeAndDisplay();
  editAccountName();
  bookmarkAccount(undefined, hasStarredAccounts);
  exportAccountsToMobile();
  exportOperationsHistory();
  hideToken();
};

export const accountsFlows = currency => {
  sortAccounts(currency);
  rangeAndDisplay(currency);
  showOperations(currency);
  removeAccount(currency);
  editAccountName(currency);
  bookmarkAccount(currency);
  exportAccountsToMobile(currency);
  exportOperationsHistory(currency);
};

export const accountsWithTokenFlows = currency => {
  sortAccounts(currency);
  rangeAndDisplay(currency);
  removeAccount(currency);
  editAccountName(currency);
  bookmarkAccount(currency);
  exportAccountsToMobile(currency);
  exportOperationsHistory(currency);
  hideToken(currency);
};
