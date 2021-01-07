// @flow
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Switch, Route } from "react-router-dom";
import type { RouterHistory, Match, Location } from "react-router-dom";
import { useSelector } from "react-redux";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import Pills from "~/renderer/components/Pills";
import type { Item } from "~/renderer/components/Pills";
import Box from "~/renderer/components/Box";
import SectionDisplay from "./sections/General";
import SectionExperimental from "./sections/Experimental";
import SectionAccounts from "./sections/Accounts";
import SectionAbout from "./sections/About";
import SectionHelp from "./sections/Help";

const getItems = (t: string => string): Item[] => [
  {
    key: "display",
    label: t("settings.tabs.display"),
    value: SectionDisplay,
  },
  {
    key: "accounts",
    label: t("settings.tabs.accounts"),
    value: SectionAccounts,
  },
  {
    key: "about",
    label: t("settings.tabs.about"),
    value: SectionAbout,
  },
  {
    key: "help",
    label: t("settings.tabs.help"),
    value: SectionHelp,
  },
  {
    key: "experimental",
    label: t("settings.tabs.experimental"),
    value: SectionExperimental,
  },
];

type Props = {
  history: RouterHistory,
  location: Location,
  match: Match,
};

// Props are passed from the <Route /> component in <Default />
const Settings = ({ history, location, match }: Props) => {
  const { t } = useTranslation();
  const accounts = useSelector(shallowAccountsSelector);
  const accountsCount = accounts.length;

  const items = useMemo(() => getItems(t), [t]);
  const processedItems = useMemo(
    () => items.filter(item => item.key !== "currencies" || accountsCount > 0),
    [items, accountsCount],
  );

  const defaultItem = items[0];

  const getCurrentTab = useCallback(
    ({ url, pathname }) => items.find(i => `${url}/${i.key}` === pathname) || items[0],
    [items],
  );

  const [tab, setTab] = useState(() =>
    getCurrentTab({ url: match.url, pathname: location.pathname }),
  );

  const handleChangeTab = useCallback(
    (item: Item) => {
      const url = `${match.url}/${item.key}`;
      if (location.pathname !== url) {
        history.push({ pathname: url, state: { source: "settings tab" } });
      }
    },
    [match, history, location],
  );

  useEffect(() => {
    setTab(getCurrentTab({ url: match.url, pathname: location.pathname }));
  }, [getCurrentTab, location, match]);

  return (
    <Box pb={4} selectable>
      <Box
        ff="Inter|SemiBold"
        color="palette.text.shade100"
        fontSize={7}
        mb={5}
        data-e2e="settings_title"
      >
        {t("settings.title")}
      </Box>
      <Pills mb={4} items={processedItems} activeKey={tab.key} onChange={handleChangeTab} />
      <Switch>
        {processedItems.map(i => (
          <Route key={i.key} path={`${match.url}/${i.key}`} component={i.value} />
        ))}
        <Route component={defaultItem.value} />
      </Switch>
    </Box>
  );
};
export default Settings;
