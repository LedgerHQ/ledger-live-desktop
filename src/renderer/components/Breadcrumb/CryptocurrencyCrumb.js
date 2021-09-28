// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import Box from "~/renderer/components/Box";
import { useHistory } from "react-router-dom";
import Button from "~/renderer/components/Button";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import { Separator, TextLink } from "./common";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import { useLocation, useRouteMatch } from "react-router";
import useTheme from "~/renderer/hooks/useTheme";

const CryptocurrencyCrumb = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { state: currency } = useLocation();
  const {
    params: { id }
  } = useRouteMatch();

  const palette = useTheme("colors.palette");

  return (
    <>
      <TextLink>
        <Button
          onClick={() => {
            setTrackingSource("market breadcrumb");
            history.push({
              pathname: "/market/"
            });
          }}
        >
          {t("market.title")}
        </Button>
      </TextLink>
      <Separator />
      <Box horizontal>
        <Box px={1}>
          <CryptoCurrencyIcon
            overrideColor={palette.text.shade60}
            inactive
            size={16}
            currency={currency}
          />
        </Box>
        {currency.name}
      </Box>
    </>
  );
};

export default CryptocurrencyCrumb;
