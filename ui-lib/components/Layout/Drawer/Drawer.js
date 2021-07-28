// @flow
import React, { useCallback } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import type { ThemedComponent } from "@ui/styles/StyleProvider";
import Button from "@ui/components/Button";
import FlexBox from "@ui/components/Layout/Flex";
import Cross from "@ui/icons/Cross";
import ArrowLeft from "@ui/icons/ArrowLeft";
import TransitionSlide from "@ui/components/Transition/TransitionSlide";
import TransitionInOut from "@ui/components/Transition/TransitionInOut";

const Container: ThemedComponent<*> = styled(FlexBox)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  background-color: ${p => p.theme.colors.palette.v2.background.default};
  padding: ${p => p.theme.space[3]}px;
`;

const Header: ThemedComponent<*> = styled(FlexBox)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 50px;
`;

const Wrapper: ThemedComponent<{ width?: number, height?: number }> = styled.div`
  height: 100%;
  width: ${p => (p.big ? p.theme.sizes.drawer.big.width : p.theme.sizes.drawer.small.width)}px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  z-index: ${p => p.theme.zIndexes[8]};
`;

const Overlay: ThemedComponent<*> = styled.div`
  display: flex;
  position: fixed;
  justify-content: flex-end;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  background-color: ${p => p.theme.colors.palette.v2.background.overlay};
`;

const ScrollWrapper: ThemedComponent<*> = styled.div`
  overflow: scroll;
  position: relative;
  flex: 1;
`;

const ButtonPlaceholder: ThemedComponent<*> = styled.div`
  min-width: 44px;
`;

type DrawerProps = {
  isOpen: boolean,
  children: React$Node,
  title?: React$Node,
  big?: boolean,
  small?: boolean,

  onClose: () => void,
  onBack?: () => void,
  setTransitionsEnabled: boolean => void,
};

const Drawer = ({
  isOpen,
  title,
  children,
  big,
  onClose,
  setTransitionsEnabled,
  onBack,
}: DrawerProps) => {
  const disableChildAnimations = useCallback(() => setTransitionsEnabled(false), [
    setTransitionsEnabled,
  ]);
  const enableChildAnimations = useCallback(() => setTransitionsEnabled(true), [
    setTransitionsEnabled,
  ]);

  return (
    <TransitionInOut
      in={isOpen}
      appear
      mountOnEnter
      unmountOnExit
      onEntering={disableChildAnimations}
      onEntered={enableChildAnimations}
      onExiting={disableChildAnimations}
    >
      <Overlay>
        <TransitionSlide in={isOpen} fixed reverseExit appear mountOnEnter unmountOnExit>
          <Wrapper big={big}>
            <Container>
              <Header>
                {onBack ? <Button Icon={ArrowLeft} onClick={onBack} /> : <ButtonPlaceholder />}
                {title || <div />}
                <Button Icon={Cross} onClick={onClose} />
              </Header>
              <ScrollWrapper>{children}</ScrollWrapper>
            </Container>
          </Wrapper>
        </TransitionSlide>
      </Overlay>
    </TransitionInOut>
  );
};

const DrawerWrapper = ({ children, ...drawerProps }: DrawerProps) => {
  const $root = React.useMemo(() => document.querySelector("#ll-drawer-root"), []);

  if ($root === null) throw new Error("drawer root cannot be found");

  return ReactDOM.createPortal(<Drawer {...drawerProps}>{children}</Drawer>, $root);
};

export default DrawerWrapper;
