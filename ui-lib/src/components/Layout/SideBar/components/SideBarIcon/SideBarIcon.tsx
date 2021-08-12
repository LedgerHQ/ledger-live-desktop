import React, { useContext } from "react";
import styled from "styled-components";

import LedgerLiveIconLarge from "@ui/assets/icons/LedgerLiveIcon";
import LedgerIconSmall from "@ui/assets/icons/LedgerIconSmall";
import { SideBarContext } from "@ui/components/Layout/SideBar/SideBar";
import TransitionInOut from "@ui/components/Transition/TransitionInOut";

const LedgerIcon = styled(LedgerLiveIconLarge)`
  width: 155px;
  margin-left: 1rem;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  overflow: hidden;
`;

const SideBarIcon = (): JSX.Element => {
  const { isExpanded } = useContext(SideBarContext);

  return (
    <Container>
      <TransitionInOut
        timeout={300}
        in={isExpanded}
        unmountOnExit
        mountOnEnter
        style={{ transitionDelay: "300ms" }}
      >
        <LedgerIcon />
      </TransitionInOut>
      <TransitionInOut
        timeout={300}
        in={!isExpanded}
        unmountOnExit
        mountOnEnter
        style={{ margin: "auto", transitionDelay: "300ms" }}
      >
        <LedgerIconSmall />
      </TransitionInOut>
    </Container>
  );
};

export default SideBarIcon;
