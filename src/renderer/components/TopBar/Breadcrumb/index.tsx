import React from "react";
import { matchPath, useLocation } from "react-router-dom";

import { Flex } from "@ledgerhq/react-ui";
import AccountCrumb from "./AccountCrumb";
import AssetCrumb from "./AssetCrumb";

const Breadcrumb = () => {
  const location = useLocation();

  const accountsPageMatch = matchPath(location.pathname, { path: "/accounts" });
  const specificAccountsMatch = matchPath(location.pathname, { path: "/account/:id" });
  const assetMatch = matchPath(location.pathname, { path: "/asset" });

  return (
    <Flex px={6}>
      {(accountsPageMatch || specificAccountsMatch) && <AccountCrumb />}
      {assetMatch && <AssetCrumb />}
    </Flex>
  );
};

export default Breadcrumb;
