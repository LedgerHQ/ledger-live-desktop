// @flow
import { setSupportedCurrencies } from "@ledgerhq/live-common/lib/currencies";
import { setPlatformVersion } from "@ledgerhq/live-common/lib/platform/version";

setPlatformVersion("0.0.1");

setSupportedCurrencies([
  "bitcoin",
  "ethereum",
  "bsc",
  "polkadot",
  "ripple",
  "litecoin",
  "bitcoin_cash",
  "stellar",
  "dogecoin",
  "cosmos",
  "dash",
  "tron",
  "tezos",
  "ethereum_classic",
  "zcash",
  "decred",
  "digibyte",
  "algorand",
  "qtum",
  "bitcoin_gold",
  "komodo",
  "pivx",
  "zencash",
  "vertcoin",
  "peercoin",
  "viacoin",
  "stakenet",
  "stealthcoin",
  "bitcoin_testnet",
  "ethereum_ropsten",
  "cosmos_testnet",
  "crypto_org_croeseid",
]);
