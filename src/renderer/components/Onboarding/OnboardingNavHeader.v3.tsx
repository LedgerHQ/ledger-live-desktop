import React from "react";
import styled from "styled-components";
import { Button, Header, Icons } from "@ledgerhq/react-ui";
import LangSwitcher from "./LangSwitcher";
import ledgerLogo from "./assets/ledgerLogo.svg";
import { registerAssets } from "~/renderer/components/Onboarding/preloadAssets";
import { useTranslation } from "react-i18next";

registerAssets([ledgerLogo]);

const OnboardingContainer = styled(Header)`
  position: absolute;
  top: 40px;
  left: 16px;
  right: 30px;
  z-index: 1;
  align-items: center;
`;

const Logo = styled.div`
  background-color: ${p => (p.theme.colors.palette.type === "light" ? "black" : "white")};
  -webkit-mask-image: url(${ledgerLogo});
  mask-image: url(${ledgerLogo});
  height: 25px;
  width: 75px;
`;

interface Props {
  onClickPrevious: (event?: React.SyntheticEvent<HTMLButtonElement, Event>) => void;
}

export default function OnboardingNavHeader({ onClickPrevious }: Props) {
  const { t } = useTranslation();
  const left = (
    <Button iconPosition="left" Icon={Icons.ArrowLeftRegular} onClick={onClickPrevious}>
      {t("common.previous")}
    </Button>
  );
  const right = <LangSwitcher />;
  return (
    <OnboardingContainer {...{ left, right }}>
      <Logo />
    </OnboardingContainer>
  );
}
