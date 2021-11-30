import React from "react";
import { useTranslation } from "react-i18next";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import Track from "~/renderer/analytics/Track";
import {   useCurrencyConfirmationsNb } from "~/renderer/actions/settings";
import {
  currencySettingsDefaults,
} from "~/renderer/reducers/settings";
import StepperNumber from "~/renderer/components/StepperNumber";
import {
  SectionRow as Row,
} from "../../Rows";
import { Flex, Text } from "@ledgerhq/react-ui";

type Props = {
  currency: CryptoCurrency | TokenCurrency
};

const CurrencyRows = ({ currency }: Props) => {
  const { t } = useTranslation();
  const [confirmationsNb, setConfirmationsNb] = useCurrencyConfirmationsNb(currency);

  // NB ideally we would have a dynamic list of settings
  const defaults = currencySettingsDefaults(currency);
   
  return (
    <Flex flexDirection="column" rowGap={12}>
      {defaults.confirmationsNb ? (
        <Row
          title={t("settings.currencies.confirmationsNb")}
          desc={t("settings.currencies.confirmationsNbDesc")}
          inset
        >
          <Track onUpdate event="ConfirmationsNb" confirmationsNb={confirmationsNb} />
          {defaults.confirmationsNb ? (
            <StepperNumber
              min={defaults.confirmationsNb.min}
              max={defaults.confirmationsNb.max}
              step={1}
              onChange={setConfirmationsNb}
              value={confirmationsNb ?? defaults.confirmationsNb.def}
            />
          ) : null}
        </Row>
      ) : (
        <Flex p={1}  alignItems="center">
          <Text ff="Inter|SemiBold" color="neutral.c80" fontSize={4}>
            {t("settings.currencies.placeholder")}
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export default CurrencyRows;
