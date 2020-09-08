// @flow
import React, { useEffect, useState } from "react";
import { Trans } from "react-i18next";
import { bitcoinPickingStrategy } from "@ledgerhq/live-common/lib/families/bitcoin/types";

type Option = { value: string, label: React$Node };

const keys = Object.keys(bitcoinPickingStrategy);
const options: Array<Option> = keys.map(value => ({
  value,
  label: <Trans i18nKey={`bitcoin.pickingStrategyLabels.${value}`} />,
}));

type BitcoinStrategyResult = {
  item: ?Option,
  options: Array<Option>,
};

const useBitcoinPickingStrategy = (strategy: number): BitcoinStrategyResult => {
  const [item, setItem] = useState(() => {
    return options.find(o => bitcoinPickingStrategy[o.value] === strategy);
  });

  useEffect(() => {
    const newItem = options.find(o => bitcoinPickingStrategy[o.value] === strategy);
    if (newItem) {
      setItem(newItem);
    }
  }, [strategy]);

  return {
    options,
    item,
  };
};

export default useBitcoinPickingStrategy;
