// @flow
import React from "react";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router";

import { useTranslation } from "react-i18next";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import { Separator, TextLink } from "./common";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";

const CryptocurrencyCrumb = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { state: currency } = useLocation();

  return (
    <>
      <TextLink>
        <Button
          onClick={() => {
            setTrackingSource("market breadcrumb");
            history.push({
              pathname: "/market/",
            });
          }}
        >
          {t("market.title")}
        </Button>
      </TextLink>
      <Separator />
      <Box horizontal>
        <Box px={1}></Box>
        {currency.name}
      </Box>
    </>
  );
};

export default CryptocurrencyCrumb;
