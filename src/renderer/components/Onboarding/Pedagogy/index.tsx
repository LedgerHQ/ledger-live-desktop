// @flow

import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Flex } from "@ledgerhq/react-ui";
import ModalStepper from "../../ModalStepper";
import accessYourCoins from "./assets/accessYourCoins.png";

const Illustration = styled(Flex)`
  background: url(${({ src }) => src}) no-repeat center;
  margin: 0 auto;
`;

type PedagogyProps = {
  isOpen: boolean;
  onDone: () => void;
  onClose: () => void;
};

export function Pedagogy({ isOpen, onDone, onClose }: PedagogyProps) {
  const { t } = useTranslation();

  return (
    <ModalStepper
      isOpen={isOpen}
      title={t("v3.onboarding.screens.pedagogy.title")}
      steps={[
        {
          title: t("v3.onboarding.screens.pedagogy.0.title"),
          description: t("v3.onboarding.screens.pedagogy.0.description"),
          AsideRight: <Illustration width={280} height={280} src={accessYourCoins} />,
        },
        {
          title: t("v3.onboarding.screens.pedagogy.1.title"),
          description: t("v3.onboarding.screens.pedagogy.1.description"),
          AsideRight: <Illustration width={280} height={280} src={accessYourCoins} />,
        },
        {
          title: t("v3.onboarding.screens.pedagogy.2.title"),
          description: t("v3.onboarding.screens.pedagogy.2.description"),
          AsideRight: <Illustration width={280} height={280} src={accessYourCoins} />,
        },
        {
          title: t("v3.onboarding.screens.pedagogy.4.title"),
          description: t("v3.onboarding.screens.pedagogy.4.description"),
          AsideRight: <Illustration width={280} height={280} src={accessYourCoins} />,
        },
      ]}
      onClose={onClose}
      onFinish={onDone}
    />
  );
}
