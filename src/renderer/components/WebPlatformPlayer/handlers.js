import { openModal } from "~/renderer/actions/modals";
import { BigNumber } from "bignumber.js";

import { accountsSelector, accountSelector } from "~/renderer/reducers/accounts";

async function testFail(state, dispatch, params) {
  throw new Error("THIS IS A FAILURE");
}

async function accountList(state, dispatch, params) {
  return accountsSelector(state);
}

async function accountGet(state, dispatch, params) {
  const { accountId } = params;

  return accountSelector(state, { accountId });
}

async function transactionSign(state, dispatch, params) {
  const { accountId, transaction } = params;

  const account = accountSelector(state, { accountId });

  console.log("TRANSACTION MODAL: ", params);

  return new Promise((resolve, reject) =>
    dispatch(
      openModal("MODAL_SIGN_TRANSACTION", {
        transactionData: {
          amount: new BigNumber(transaction.amount),
          data: transaction.data ? Buffer.from(transaction.data) : undefined,
          userGasLimit: transaction.gasLimit ? new BigNumber(transaction.gasLimit) : undefined,
          gasLimit: transaction.gasLimit ? new BigNumber(transaction.gasLimit) : undefined,
          gasPrice: transaction.gasPrice ? new BigNumber(transaction.gasPrice) : undefined,
          family: transaction.family,
          recipient: transaction.recipient,
        },
        account,
        parentAccount: null,
        onResult: resolve,
        onCancel: () => resolve(null),
      }),
    ),
  );
}

async function accountReceive(state, dispatch, params) {
  const { accountId } = params;

  const account = accountSelector(state, { accountId });

  return new Promise((resolve, reject) =>
    dispatch(
      openModal("MODAL_EXCHANGE_CRYPTO_DEVICE", {
        account,
        parentAccount: null,
        onResult: resolve,
        onCancel: () => resolve(null),
        verifyAddress: true,
      }),
    ),
  );
}

const handlers = {
  "account.get": accountGet,
  "account.list": accountList,
  "account.receive": accountReceive,
  "transaction.sign": transactionSign,
  fail: testFail,
};

export default handlers;
