// @flow
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Switch, Route } from "react-router-dom";
import type { RouterHistory, Match, Location } from "react-router-dom";
import { useSelector } from "react-redux";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import type { Item } from "~/renderer/components/Pills";
import Box from "~/renderer/components/Box";
import TabBar from "~/renderer/components/TabBar";
import { SettingsSection as Section } from "./SettingsSection";
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
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const processedItems = useMemo(
    () => items.filter(item => item.key !== "currencies" || accountsCount > 0),
    [items, accountsCount],
  );

  const defaultItem = items[0];

  const handleChangeTab = useCallback(
    (index: number) => {
      const item = items[index];
      const url = `${match.url}/${item.key}`;
      if (location.pathname !== url) {
        history.push({ pathname: url, state: { source: "settings tab" } });
        setActiveTabIndex(index);
      }
    },
    [match, history, location, items],
  );

  useEffect(() => {
    const url = `${match.url}/${items[activeTabIndex].key}`;
    if (location.pathname === "/settings") {
      setActiveTabIndex(0);
      return;
    }

    if (url !== location.pathname) {
      const idx = items.findIndex(val => {
        return `${match.url}/${val.key}` === location.pathname;
      });

      if (idx > -1 && idx !== activeTabIndex) {
        setActiveTabIndex(idx);
      }
    }
  }, [match, history, location, items, activeTabIndex]);

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
      <Section>
        <TabBar
          onIndexChange={handleChangeTab}
          defaultIndex={activeTabIndex}
          index={activeTabIndex}
          tabs={items.map(i => i.label)}
          ids={items.map(i => `settings-${i.key}`)}
          separator
          withId
          fontSize={14}
        />
        <Switch>
          {processedItems.map(i => (
            <Route key={i.key} path={`${match.url}/${i.key}`} component={i.value} />
          ))}
          <Route component={defaultItem.value} />
        </Switch>
      </Section>
    </Box>
  );
};
export default Settings;
