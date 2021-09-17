// @flow

import {createAction} from "redux-actions";
import {useSelector} from "react-redux";
import {counterValueCurrencySelector} from "~/renderer/reducers/settings";
import {listSupportedCurrencies} from "@ledgerhq/live-common/lib/currencies";
import {BigNumber} from "bignumber.js";
import {useCalculateMany} from "@ledgerhq/live-common/lib/countervalues/react";

export const openPlatformAppDisclaimerDrawer = createAction(
    "MARKET_BUILD_CURRENCIES_LIST",
    useMarketCurrencies,
);

export function useMarketCurrencies() { // here we will pass { range, counterValue } via props and will use this hook in useEffect when they changes
    const currencies = listSupportedCurrencies();
    const c1 = currencies[0];

    const counterValueCurrency = useSelector(counterValueCurrencySelector);

    // here is count (data points) and increment (date steps) for 24 hours hardcoded. Should depends on range
    const count = 24;
    const increment = 60 * 60 * 1000;

    const inputData = [];
    let t = Date.now() - count * increment;

    for (let i = 0; i < count; i++) {
        const date = new Date(t);
        inputData.push({date, value: 0});
        t += increment;
    }

    // TEST CODE
    const inputData2 = [];
    let time = Date.now() - count * increment;

    const value1 = 10 ** c1.units[0].magnitude;
    for (let i = 0; i < count; i++) {
        const date = new Date(time);
        inputData2.push({date, value: value1});
        time += increment;
    }
    const test = useCalculateMany(inputData2, {
        from: c1,
        to: counterValueCurrency,
        disableRounding: false,
    });

    console.log('c1', c1)
    console.log('counterValueCurrency', counterValueCurrency)
    console.log('inputData2', inputData2)
    console.log('TEST', test)
    // END OF TEST CODE

    currencies.map(currency => {
        const valueNum = 10 ** currency.units[0].magnitude;
        const value = valueNum instanceof BigNumber ? valueNum.toNumber() : valueNum;
        const currencyInputData = inputData.map(dataPoint => {
            dataPoint.value = value;

            return dataPoint;
        });
        const data =
            useCalculateMany(currencyInputData, {
                from: currency,
                to: counterValueCurrency,
                disableRounding: false,
            }) || [];
        currency.counterValue = data;
        currency.price = data[data.length - 1];
        currency.change = (data[data.length - 1] - data[0]) / data[data.length - 1];

        return currency;
    });

    return currencies;
}
