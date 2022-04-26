import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { matchPath, useHistory } from "react-router-dom";
import { useDistribution } from "~/renderer/actions/general";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import { Breadcrumb } from "@ledgerhq/react-ui";

export default function AssetCrumb() {
  const { t } = useTranslation();
  const distribution = useDistribution();
  const history = useHistory();

  const assetMatch = matchPath<{ assetId: string }>(history.location.pathname, {
    path: "/asset/:assetId",
  });
  const assetId = assetMatch?.params.assetId;

  const activeItem = useMemo(() => distribution.list.find(dist => dist.currency.id === assetId), [
    assetId,
    distribution.list,
  ]);

  if (!distribution || !distribution.list) return null;

  const segments = useMemo(() => {
    let items = [];

    items.push({ label: t("dashboard.title"), value: "portfolio" });

    if (activeItem) {
      const options = distribution.list.map(({ currency }) => ({
        value: currency.id,
        label: currency.name,
      }));

      items.push({
        value: { label: activeItem?.currency.name, value: activeItem?.currency.id },
        options,
      });
    }

    return items;
  }, [activeItem, t, distribution]);

  const handleOnChange = useCallback(values => {
    setTrackingSource("account breadcrumb");
    if (values.length === 1) {
      // clicked at the root of the breadcrumb (portfolio link)
      history.push({ pathname: `/` });
    } else if (values.length === 2) {
      // clicked on a currency account
      const currencyId = values[1];
      history.push({ pathname: `/asset/${currencyId}` });
    }
  }, []);

  return <Breadcrumb onChange={handleOnChange} segments={segments} />;
}
