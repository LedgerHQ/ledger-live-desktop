// @flow
import React from "react";
import { Trans } from "react-i18next";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import Box from "~/renderer/components/Box";

import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import Tooltip from "~/renderer/components/Tooltip";
import IconExclamationCircle from "~/renderer/icons/ExclamationCircle";
import { colors } from "~/renderer/styles/theme";
import Text from "~/renderer/components/Text";
import type { CurrencyStatus } from "@ledgerhq/live-common/lib/exchange/swap/logic";

const CurrencyOptionRow = ({
  status,
  circle,
  currency,
}: {
  status?: CurrencyStatus,
  circle?: boolean,
  currency: CryptoCurrency | TokenCurrency,
}) => {
  const notOK = !!status && status !== "ok";
  const mainCurrency = currency.type === "TokenCurrency" ? currency.parentCurrency : currency;
  return (
    <Box grow horizontal alignItems="center" flow={2}>
      <CryptoCurrencyIcon
        inactive={notOK}
        circle={circle}
        currency={currency}
        size={circle ? 26 : 16}
      />
      <Box
        grow
        ff="Inter|SemiBold"
        color="palette.text.shade100"
        fontSize={4}
        style={{ opacity: notOK ? 0.2 : 1 }}
      >
        {`${currency.name} (${currency.ticker})`}
      </Box>
      {!!status && notOK ? (
        <Box style={{ marginRight: -23 }} alignItems={"flex-end"}>
          <Tooltip
            content={
              <Box p={1} style={{ maxWidth: 120 }}>
                <Text fontSize={2}>
                  <Trans
                    i18nKey={`swap.form.${status}`}
                    values={{ currencyName: mainCurrency.name }}
                  />
                </Text>
              </Box>
            }
          >
            <IconExclamationCircle color={colors.orange} size={16} />
          </Tooltip>
        </Box>
      ) : null}
    </Box>
  );
};

export default CurrencyOptionRow;
