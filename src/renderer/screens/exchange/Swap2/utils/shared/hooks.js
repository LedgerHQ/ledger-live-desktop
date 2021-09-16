// @flow
import { useReducer, useEffect, useMemo } from "react";
import type { AvailableProviderV3 } from "@ledgerhq/live-common/lib/exchange/swap/types";
import { getProviders, getKYCStatus } from "@ledgerhq/live-common/lib/exchange/swap";
import type {
  Currency,
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types/currencies";
import { findCryptoCurrencyById, findTokenById } from "@ledgerhq/cryptoassets";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import { useCurrencyAccountSelect } from "~/renderer/components/PerCurrencySelectAccount/state";
import type { UseCurrencyAccountSelectReturnType } from "~/renderer/components/PerCurrencySelectAccount/state";
import { useSelector } from "react-redux";
import type { Account, TokenAccount, AccountLike } from "@ledgerhq/live-common/lib/types";
import { KYC_STATUS } from "./index";

type State = {
  isLoading: boolean,
  error: ?Error,
  providers: ?Array<AvailableProviderV3>,
};

type ActionType =
  | { type: "SAVE_DATA", payload: $PropertyType<State, "providers"> }
  | { type: "SAVE_ERROR", payload: $PropertyType<State, "error"> };

const reducer = (state: State, action: ActionType) => {
  switch (action.type) {
    case "SAVE_DATA":
      return { error: null, providers: action.payload, isLoading: false };
    case "SAVE_ERROR":
      return { error: action.payload, providers: null, isLoading: false };
    default:
      throw new Error("Uncorrect action type");
  }
};

export const initialState = { isLoading: true, error: null, providers: null };

const filterDisabledProviders = (provider: AvailableProviderV3) =>
  !process.env.SWAP_DISABLED_PROVIDERS?.includes(provider.provider);

export const useSwapProviders = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let isMounted = true;

    const saveProviders = async () => {
      try {
        const allProviders = await getProviders();
        // TODO: Fix type issue AvailableProviderV2 -> : Array<AvailableProviderV3>
        // $FlowFixMe
        const providers = allProviders.filter(filterDisabledProviders);

        if (isMounted) dispatch({ type: "SAVE_DATA", payload: providers });
      } catch (error) {
        if (isMounted) dispatch({ type: "SAVE_ERROR", payload: error });
      }
    };

    saveProviders();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
};

/*
 ** As useCurrencyAccountSelect hook return the old account/parentAccount convention
 ** I have to cast them to the new account/parentAccount convention. That's why
 ** I created these complex types and why I cast some returned values to the
 ** any types and the end of the useSelectableCurrencies function.
 ** TODO: Once we have reworked useCurrencyAccountSelect hooks to use new
 ** account/subAccout convention, please remove
 ** RestCurrencyAccountSelectReturnType/AccountParentAccountType types
 */
type RestCurrencyAccountSelectReturnType = $Rest<
  UseCurrencyAccountSelectReturnType,
  {|
    account: $PropertyType<UseCurrencyAccountSelectReturnType, "account">,
    parentAccount: $PropertyType<UseCurrencyAccountSelectReturnType, "parentAccount">,
  |},
>;
type AccountParentAccountType = { account: Account | TokenAccount, parentAccount: ?Account };
export type useSelectableCurrenciesReturnType = RestCurrencyAccountSelectReturnType &
  AccountParentAccountType & { currencies: Array<CryptoCurrency | TokenCurrency> };

export const useSelectableCurrencies = ({ allCurrencies }: { allCurrencies: Array<string> }) => {
  const allAccounts = useSelector(shallowAccountsSelector);

  const currencies: $PropertyType<useSelectableCurrenciesReturnType, "currencies"> = useMemo(() => {
    const tokens = allCurrencies.map(findTokenById).filter(Boolean);
    const cryptoCurrencies = allCurrencies.map(findCryptoCurrencyById).filter(Boolean);
    return [...tokens, ...cryptoCurrencies];
  }, [allCurrencies]);

  const {
    subAccount,
    account: receivedAccount,
    ...currencyAccountSelect
  } = useCurrencyAccountSelect({
    allCurrencies: currencies,
    allAccounts: allAccounts,
    defaultCurrency: null,
    defaultAccount: null,
  });

  /*
   ** Related to the comments above. I have to cast account/parentAccount data
   ** to shape them to the new account/parentAccount convention.
   ** TODO: Remove these lines as soon as useCurrencyAccountSelect is reworked
   */
  const { account, parentAccount }: AccountParentAccountType = subAccount
    ? { account: (subAccount: any), parentAccount: receivedAccount }
    : { account: (receivedAccount: any), parentAccount: null };

  return { ...currencyAccountSelect, currencies, account, parentAccount };
};

export const usePickExchangeRate = ({ exchangeRates, exchangeRate, setExchangeRate }: *) => {
  useEffect(() => {
    const hasRates = exchangeRates && exchangeRates.length > 0;
    // If a the user picked an exchange rate before, try to select the new one that matches.
    // Otherwise pick the first one.
    const rate =
      hasRates &&
      ((exchangeRate &&
        exchangeRates.find(
          ({ tradeMethod, provider }) =>
            tradeMethod === exchangeRate.tradeMethod && provider === exchangeRate.provider,
        )) ||
        exchangeRates[0]);
    setExchangeRate(rate || null);
    // eslint-disable-next-line
  }, [exchangeRates]);
};

// Poll the server to update the KYC status of a given provider.
const KYC_STATUS_POLLING_INTERVAL = 10000;
type kycItem = {
  id: string,
  status: string,
};
export const usePollKYCStatus = (
  { provider, kyc, onChange }: { provider: string, kyc: kycItem, onChange: kycItem => void },
  dependencies: any[] = [],
) => {
  useEffect(
    () => {
      if (kyc?.status !== KYC_STATUS.pending) return;
      let cancelled = false;
      async function updateKYCStatus() {
        if (!kyc?.id) return;
        const res = await getKYCStatus(provider, kyc.id);
        if (cancelled || res?.status === kyc?.status) return;
        onChange(res);
      }
      const intervalId = setInterval(updateKYCStatus, KYC_STATUS_POLLING_INTERVAL);
      updateKYCStatus();
      return () => {
        cancelled = true;
        clearInterval(intervalId);
      };
    },
    // eslint-disable-next-line
    [provider, kyc, ...dependencies],
  );
};

// Pick a default source account if none are selected.
export const usePickDefaultAccount = (
  accounts: AccountLike[],
  fromAccount: ?AccountLike,
  setFromAccount: AccountLike => void,
) => {
  useEffect(() => {
    if (!fromAccount) {
      const possibleDefaults = accounts.reduce((acc, account) => {
        if (account.disabled) return acc;
        if (account.currency?.id === "ethereum" && (acc[0]?.balance ?? -1) < account.balance) {
          acc[0] = account;
        }
        if (account.currency?.id === "bitcoin" && (acc[1]?.balance ?? -1) < account.balance) {
          acc[1] = account;
        }
        const maxFundsAccount = acc[2];
        if (!maxFundsAccount || maxFundsAccount.balance < account.balance) {
          acc[2] = account;
        }
        return acc;
      }, []);
      const defaultAccount = possibleDefaults.find(Boolean);
      defaultAccount && setFromAccount(defaultAccount);
    }
  }, [accounts, fromAccount, setFromAccount]);
};

// Pick a default currency target if none are selected.
export const usePickDefaultCurrency = (
  currencies: Currency[],
  currency: ?Currency,
  setCurrency: Currency => void,
) => {
  useEffect(() => {
    if (!currency) {
      const defaultCurrency = currencies.find(
        currency => currency.id === "ethereum" || currency.id === "bitcoin",
      );
      defaultCurrency && setCurrency(defaultCurrency);
    }
  }, [currency, currencies, setCurrency]);
};
