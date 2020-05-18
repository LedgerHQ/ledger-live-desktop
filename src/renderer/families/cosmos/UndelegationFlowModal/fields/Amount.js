// @flow
import React from "react";
import { BigNumber as BN } from "bignumber.js";
import type { BigNumber } from "bignumber.js";
import { useTranslation } from "react-i18next";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import type { Account } from "@ledgerhq/live-common/lib/types";
import Box from "~/renderer/components/Box";
import InputCurrency from "~/renderer/components/InputCurrency";
import Label from "~/renderer/components/Label";

type Props = {
  account: Account,
  onChange: (amount: BigNumber) => void,
};

export default function AmountField({ account, onChange }: Props) {
  const { t } = useTranslation();
  const unit = getAccountUnit(account);

  return (
    <Box mt={5}>
      <Label>{t("cosmos.undelegation.flow.steps.amount.fields.amount")}</Label>
      <InputCurrency
        autoFocus={false}
        // error={amountError}
        // warning={warnings.amount}
        containerProps={{ grow: true }}
        unit={unit}
        // value={amount}
        value={BN(0)}
        decimals={0}
        onChange={onChange}
        // renderLeft={<InputLeft>{defaultUnit.code}</InputLeft>}
        // renderRight={
        //   showAmountRatio && (
        //     <InputRight>
        //       {amountButtons.map(({ label, value }, key) => (
        //         <AmountButton
        //           active={ratio === label}
        //           key={key}
        //           error={!!amountError}
        //           onClick={() => onSelectRatio(label, value)}
        //         >
        //           {label}
        //         </AmountButton>
        //       ))}
        //     </InputRight>
        //   )
        // }
      />
    </Box>
  );
}
