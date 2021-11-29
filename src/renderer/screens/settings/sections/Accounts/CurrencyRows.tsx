import React from "react";
import { Trans, useTranslation } from "react-i18next";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import Track from "~/renderer/analytics/Track";
import {   useCurrencyConfirmationsNb } from "~/renderer/actions/settings";
import {
  currencySettingsDefaults,
} from "~/renderer/reducers/settings";
import type { SettingsState, CurrencySettings } from "~/renderer/reducers/settings";
import StepperNumber from "~/renderer/components/StepperNumber";
import {
  SettingsSectionRow as Row,
} from "../../SettingsSection";
import { Flex, Text } from "@ledgerhq/react-ui";

type Props = {
  currency: CryptoCurrency | TokenCurrency,
  currencySettings: CurrencySettings,
  settings: SettingsState,
  saveSettings: (state: Partial<SettingsState>) => void,
};

const CurrencyRows = ({ currency }: Props) => {
  const { t } = useTranslation();
   const [confirmationsNb, setConfirmationsNb] = useCurrencyConfirmationsNb(currency);

   const defaults = currencySettingsDefaults(currency);
   // NB ideally we would have a dynamic list of settings
   
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
                    value={confirmationsNb}
                  />
                ) : null}
              </Row>
            ) : (
              <Flex p={1}  alignItems="center" justifyContent="space-between">
                <Text ff="Inter|SemiBold" color="palette.text.shade100" fontSize={4}>
                  {t("settings.currencies.placeholder")}
                </Text>
              </Flex>
            )}
          </Flex>
        );

};

// class CurrencyRows extends PureComponent<Props> {
//   handleChangeConfirmationsNb = (nb: number) => this.updateCurrencySettings("confirmationsNb", nb);

//   updateCurrencySettings = (key: string, val: *) => {
//     // FIXME this really should be a dedicated action
//     const { settings, saveSettings, currency } = this.props;
//     const currencySettings = settings.currenciesSettings[currency.ticker];
//     let newCurrenciesSettings = [];
//     if (!currencySettings) {
//       newCurrenciesSettings = {
//         ...settings.currenciesSettings,
//         [currency.ticker]: {
//           [key]: val,
//         },
//       };
//     } else {
//       newCurrenciesSettings = {
//         ...settings.currenciesSettings,
//         [currency.ticker]: {
//           ...currencySettings,
//           [key]: val,
//         },
//       };
//     }
//     saveSettings({ currenciesSettings: newCurrenciesSettings });
//   };

//   render() {
//     const { currency, t, currencySettings } = this.props;
//     const { confirmationsNb } = currencySettings;
//     const defaults = currencySettingsDefaults(currency);
//     // NB ideally we would have a dynamic list of settings

//     return (
//       <Body>
//         {defaults.confirmationsNb ? (
//           <Row
//             title={t("settings.currencies.confirmationsNb")}
//             desc={t("settings.currencies.confirmationsNbDesc")}
//             inset
//           >
//             <Track onUpdate event="ConfirmationsNb" confirmationsNb={confirmationsNb} />
//             {defaults.confirmationsNb ? (
//               <StepperNumber
//                 min={defaults.confirmationsNb.min}
//                 max={defaults.confirmationsNb.max}
//                 step={1}
//                 onChange={this.handleChangeConfirmationsNb}
//                 value={confirmationsNb}
//               />
//             ) : null}
//           </Row>
//         ) : (
//           <SettingsSectionRowContainer>
//             <Box ff="Inter|SemiBold" color="palette.text.shade100" fontSize={4}>
//               <Trans i18nKey="settings.currencies.placeholder" />
//             </Box>
//           </SettingsSectionRowContainer>
//         )}
//       </Body>
//     );
//   }
// }

export default CurrencyRows;
