import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Switch, Route, RouteComponentProps } from "react-router-dom";
import { useSelector } from "react-redux";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import type { Item } from "~/renderer/components/Pills";
import { Text, Flex, Chip, Divider, Box } from "@ledgerhq/react-ui";
import SectionDisplay from "./sections/General";
import SectionExperimental from "./sections/Experimental";
import SectionDeveloper from "./sections/Developer";
import SectionAccounts from "./sections/Accounts";
import SectionAbout from "./sections/About";
import SectionHelp from "./sections/Help";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import { developerModeSelector } from "../../reducers/settings";

const getItems = (t: (key: string) => string, devMode?: boolean): Item[] => {
  const items = [
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

  if (devMode) {
    items.push({
      key: "developer",
      label: t("settings.tabs.developer"),
      value: SectionDeveloper,
    });
  }

  return items;
};

// Props are passed from the <Route /> component in <Default />
const Settings = ({ history, location, match }: RouteComponentProps) => {
  const { t } = useTranslation();
  const accounts = useSelector(shallowAccountsSelector);
  const accountsCount = accounts.length;
  const devMode = useSelector(developerModeSelector);

  const items = useMemo(() => getItems(t, devMode), [t, devMode]);
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
        setTrackingSource("settings tab");
        history.push({ pathname: url });
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
      setActiveTabIndex(idx > -1 && idx !== activeTabIndex ? idx : 0);
    }
  }, [match, history, location, items, activeTabIndex]);

  return (
    <Flex flexDirection="column" rowGap={10} pt={4} pb={10}>
      <Flex flexDirection="column" rowGap={10} px={12}>
        <Text variant="h3" lineHeight="1.15">{t("settings.title")}</Text>
        <Chip 
          initialActiveIndex={activeTabIndex}
          onTabChange={handleChangeTab}
        >
          {
            items.map((item, i) => (
                <Text
                  lineHeight="1.15"
                  fontWeight="600"
                  color={i === activeTabIndex ? "palette.neutral.c100" : "palette.neutral.c80"}
                  variant="small"
                >
                  {t(item.label)}
                </Text>
            ))
          }
        </Chip>
      </Flex>
      <Divider variant="light" />
      <Box px={12}>
        <Switch>
          {processedItems.map(i => (
            <Route key={i.key} path={`${match.url}/${i.key}`} component={i.value} />
          ))}
          <Route component={defaultItem.value} />
        </Switch>
      </Box>
    </Flex>
  );
};
export default Settings;
