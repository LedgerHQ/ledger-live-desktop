// @flow
import React, { useMemo } from "react";

import { useLocation, useHistory } from "react-router-dom";
import TabBar from "~/renderer/components/TabBar";
import { useTranslation } from "react-i18next";
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

  const tabs = useMemo(
    () => swapRoutes.filter(route => !route.disabled).map(route => t(route.title)),
    [t],
  );

  const onWrappedTabChange = nextIndex => {
    if (currentIndex === nextIndex) return;
    const nextPathname = swapRoutes[nextIndex].path;
    history.push({ pathname: nextPathname });
  };

  return (
    currentIndex >= 0 && (
      <Nav>
        <TabBar tabs={tabs} onIndexChange={onWrappedTabChange} index={currentIndex} />
      </Nav>
    )
  );
};

export default Navbar;
