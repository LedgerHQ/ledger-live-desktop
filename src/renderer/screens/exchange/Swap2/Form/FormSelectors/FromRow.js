// @flow
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Trans, withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import { BigNumber } from "bignumber.js";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import Box from "~/renderer/components/Box";
import InputCurrency from "~/renderer/components/InputCurrency";
import { SelectAccount } from "~/renderer/components/SelectAccount";
import Switch from "~/renderer/components/Switch";
import Text from "~/renderer/components/Text";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import { amountInputContainerProps, selectRowStylesMap } from "./utils";
import { FormLabel } from "./FormLabel";
import type { Account } from "@ledgerhq/live-common/lib/types";

type Props = {
  fromAccount: ?Account,
  setFromAccount: (?Account) => void,
  fromAmount: ?BigNumber,
  setFromAmount: BigNumber => void,
  t: TFunction,
};

function FromRow({ fromAmount, setFromAmount, fromAccount, setFromAccount, t }: Props) {
  const accounts = useSelector(shallowAccountsSelector);
  const [maxFrom, setMaxFrom] = useState(false);
  const unit = fromAccount && getAccountUnit(fromAccount);

  return (
    <>
      <Box
        horizontal
        justifyContent="space-between"
        alignItems="flex-end"
        fontSize={3}
        mb={2}
        color={"palette.text.shade40"}
      >
        <FormLabel>
          <Trans i18nKey="swap2.form.from.title" />
        </FormLabel>
        <Box horizontal alignItems="center">
          <Text marginRight={1} fontWeight="500">
            <Trans i18nKey="swap2.form.from.max" />
          </Text>
          <Switch medium isChecked={maxFrom} onChange={_ => setMaxFrom(value => !value)} />
        </Box>
      </Box>
      <Box horizontal mb="26px" boxShadow="0px 2px 4px rgba(0, 0, 0, 0.05);">
        <Box width="50%">
          <SelectAccount
            accounts={accounts}
            value={fromAccount}
            // $FlowFixMe
            onChange={setFromAccount}
            stylesMap={selectRowStylesMap}
            placeholder={t("swap2.form.from.accountPlaceholder")}
          />
        </Box>
        <Box width="50%">
          <InputCurrency
            value={fromAmount}
            onChange={setFromAmount}
            disabled={!fromAccount || maxFrom}
            placeholder="0"
            textAlign="right"
            containerProps={amountInputContainerProps}
            // $FlowFixMe
            unit={unit}
            // Flow complains if this prop is missing…
            renderRight={null}
          />
        </Box>
      </Box>
    </>
  );
}

export default withTranslation()(FromRow);
