/**
 * @module models/account
 * @flow
 */
import { createDataModel } from "@ledgerhq/live-common/lib/DataModel";
import { fromAccountRaw, toAccountRaw } from "@ledgerhq/live-common/lib/account";
import type { DataModel } from "@ledgerhq/live-common/lib/DataModel";
import type { Account, AccountRaw, Operation } from "@ledgerhq/live-common/lib/types";

/**
 * @memberof models/account
 */
export const opRetentionStategy = (maxDaysOld: number, keepFirst: number) => (
  op: Operation,
  index: number,
): boolean => index < keepFirst || Date.now() - op.date < 1000 * 60 * 60 * 24 * maxDaysOld;

const opRetentionFilter = opRetentionStategy(366, 500);

const accountModel: DataModel<AccountRaw, Account> = createDataModel({
  migrations: [
    // 2018-10-10: change of the account id format to include the derivationMode and seedIdentifier in Account
    raw => {
      raw = { ...raw };
      const { currencyId, freshAddressPath } = raw;
      const [type, originalVersion, xpubOrAddress, walletName] = raw.id.split(":");
      let version = originalVersion;
      let derivationMode;
      let seedIdentifier;
      switch (type) {
        case "libcore": {
          const i = walletName.indexOf("__") + currencyId.length + 1;
          derivationMode = walletName.slice(i + 2);
          seedIdentifier = walletName.slice(0, i);
          break;
        }

        case "ethereumjs": {
          // reverse the derivation that was used to infer what was the derivationMode
          if (freshAddressPath.match(/^44'\/60'\/0'\/[0-9]+$/)) {
            derivationMode = "ethM";
          } else if (
            currencyId === "ethereum_classic" &&
            freshAddressPath.match(/^44'\/60'\/160720'\/0'\/[0-9]+$/)
          ) {
            derivationMode = "etcM";
          } else {
            derivationMode = "";
          }
          delete raw.xpub;
          seedIdentifier = xpubOrAddress;
          version = "2"; // replace version because no need to have the currencyId like used to do.
          break;
        }

        case "ripplejs": {
          // reverse the derivation that was used to infer what was the derivationMode
          if (freshAddressPath.match(/^44'\/144'\/0'\/[0-9]+'$/)) {
            derivationMode = "rip";
          } else {
            derivationMode = "";
          }
          delete raw.xpub;
          seedIdentifier = xpubOrAddress;
          version = "2"; // replace version because no need to have the currencyId like used to do.
          break;
        }

        default:
          // this case should never happen
          throw new Error(`unknown Account type=${type}`);
      }

      const id = `${type}:${version}:${currencyId}:${xpubOrAddress}:${derivationMode}`;
      return {
        ...raw,
        id,
        derivationMode,
        seedIdentifier,
      };
    },
    // ^- Each time a modification is brought to the model, add here a migration function here
  ],

  decode: fromAccountRaw,

  encode: (account: Account): AccountRaw =>
    toAccountRaw({
      ...account,
      operations: account.operations.filter(opRetentionFilter),
    }),
});

export default accountModel;
