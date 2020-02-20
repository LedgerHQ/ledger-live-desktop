// @flow

import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components";
import type { TokenCurrency, CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import {
  currenciesStatusSelector,
  currencyDownStatusLocal,
} from "~/renderer/reducers/currenciesStatus";
import { openURL } from "~/renderer/linking";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";
import IconTriangleWarning from "~/renderer/icons/TriangleWarning";
import IconExternalLink from "~/renderer/icons/ExternalLink";

const CurrencyDownBox: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: "center",
  color: "palette.background.paper",
  borderRadius: 1,
  fontSize: 1,
  px: 4,
  py: 2,
  mb: 4,
}))`
  background-color: ${p => (p.warning ? p.theme.colors.orange : p.theme.colors.alertRed)};
`;

const Link = styled.span`
  margin-left: 5px;
  margin-right: 5px;
  text-decoration: underline;
  cursor: pointer;
`;

type Props = {
  currency: CryptoCurrency | TokenCurrency,
};

const CurrencyDownStatusAlert = ({ currency }: Props) => {
  const { t } = useTranslation();
  const currenciesStatus = useSelector(currenciesStatusSelector);
  // $FlowFixMe currency can be a TokenCurrency :/
  const status = useMemo(() => currencyDownStatusLocal(currenciesStatus, currency), [
    currency,
    currenciesStatus,
  ]);
  const onClick = useCallback(() => {
    if (status) openURL(status.link);
  }, [status]);

  return status ? (
    <CurrencyDownBox warning={!!status.warning}>
      <Box mr={2}>
        <IconTriangleWarning height={16} width={16} />
      </Box>
      <Box style={{ display: "block" }} ff="Inter|SemiBold" fontSize={3} horizontal shrink>
        {status.message}
        <Link onClick={onClick}>{t("common.learnMore")}</Link>
        <IconExternalLink size={12} />
      </Box>
    </CurrencyDownBox>
  ) : null;
};

export default CurrencyDownStatusAlert;
