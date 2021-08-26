// @flow
import { useReducer, useEffect, useMemo } from "react";
import type { AvailableProviderV3 } from "@ledgerhq/live-common/lib/exchange/swap/types";
import { getProviders } from "@ledgerhq/live-common/lib/exchange/swap";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types/currencies";
import { findCryptoCurrencyById, findTokenById } from "@ledgerhq/cryptoassets";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import { useCurrencyAccountSelect } from "~/renderer/components/PerCurrencySelectAccount/state";
import type { UseCurrencyAccountSelectReturnType } from "~/renderer/components/PerCurrencySelectAccount/state";
import { useSelector } from "react-redux";
import type { Account, TokenAccount } from "@ledgerhq/live-common/lib/types";

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
    if (rate) {
      setExchangeRate(rate);
    } else {
      setExchangeRate(null);
    }
    // eslint-disable-next-line
  }, [exchangeRates]);
};
