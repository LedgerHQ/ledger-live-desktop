// @flow
import React, { useMemo } from "react";

import { useLocation, useHistory } from "react-router-dom";
import TabBar from "~/renderer/components/TabBar";
import { useTranslation } from "react-i18next";
import TrackPage, { setTrackingSource } from "~/renderer/analytics/TrackPage";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import swapRoutes from "./routes.json";

const Nav: ThemedComponent<{}> = styled.nav`
  background-color: ${p => p.theme.colors.palette.background.paper};

  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
`;

/*
 ** This component manages routing logic for swap screens and send
 ** tracking data to analytics.
 */
const Navbar = () => {
  const { pathname } = useLocation();
  const history = useHistory();
  const { t } = useTranslation();

  const currentIndex = useMemo(() => {
    return swapRoutes.findIndex(route => route.path === pathname);
  }, [pathname]);

  const tabs = useMemo(() => swapRoutes.map(route => t(route.title)), []);

  const onWrappedTabChange = nextIndex => {
    if (currentIndex === nextIndex) return;

    const nextPathname = swapRoutes[nextIndex].path;
    setTrackingSource("swap/navbar");
    history.push({ pathname: nextPathname });
  };

  return (
    <Nav>
      <TrackPage category="swap" name={swapRoutes[currentIndex].name} />
      <TabBar tabs={tabs} onIndexChange={onWrappedTabChange} index={currentIndex} />
    </Nav>
  );
};

export default Navbar;
