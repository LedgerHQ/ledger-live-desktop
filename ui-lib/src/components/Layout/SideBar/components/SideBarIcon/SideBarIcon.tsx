import React from "react";
import styled from "styled-components";

import LedgerLiveIconLarge from "@ui/assets/icons/LedgerLiveIcon";
import LedgerIconSmall from "@ui/assets/icons/LedgerIconSmall";

const LedgerIcon = styled(LedgerLiveIconLarge)`
  width: 155px;
  margin-left: 1rem;
`;

type SideBarIconType = { isExpanded?: boolean };
const SideBarIcon = ({ isExpanded = true }: SideBarIconType): JSX.Element =>
  isExpanded ? <LedgerIcon /> : <LedgerIconSmall />;

export default SideBarIcon;
