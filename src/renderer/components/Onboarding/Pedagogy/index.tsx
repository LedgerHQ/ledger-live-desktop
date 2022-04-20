import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Flex } from "@ledgerhq/react-ui";
import ModalStepper from "../../ModalStepper";
import accessYourCoins from "./assets/accessYourCoins.png";

const Illustration = styled(Flex)`
  background: url(${p => p.src}) no-repeat center;
  background-size: contain;
  margin: 0 auto;
  width: ${p => p.width}px;
  height: ${p => p.height}px;
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
      title={t("v3.onboarding.pedagogy.heading")}
      steps={[
        {
          title: t("v3.onboarding.pedagogy.screens.accessYourCoins.title"),
          description: t("v3.onboarding.pedagogy.screens.accessYourCoins.description"),
          AsideRight: <Illustration width={280} height={280} src={accessYourCoins} />,
        },
        {
          title: t("v3.onboarding.pedagogy.screens.ownYourPrivateKey.title"),
          description: t("v3.onboarding.pedagogy.screens.ownYourPrivateKey.description"),
          AsideRight: <Illustration width={280} height={280} src={accessYourCoins} />,
        },
        {
          title: t("v3.onboarding.pedagogy.screens.stayOffline.title"),
          description: t("v3.onboarding.pedagogy.screens.stayOffline.description"),
          AsideRight: <Illustration width={280} height={280} src={accessYourCoins} />,
        },
        {
          title: t("v3.onboarding.pedagogy.screens.validateTransactions.title"),
          description: t("v3.onboarding.pedagogy.screens.validateTransactions.description"),
          AsideRight: <Illustration width={280} height={280} src={accessYourCoins} />,
        },
        {
          title: t("v3.onboarding.pedagogy.screens.setUpNanoWallet.title"),
          description: t("v3.onboarding.pedagogy.screens.setUpNanoWallet.description"),
          AsideRight: <Illustration width={280} height={280} src={accessYourCoins} />,
          continueLabel: t("v3.onboarding.pedagogy.screens.setUpNanoWallet.CTA"),
        },
      ]}
      onClose={onClose}
      onFinish={onDone}
    />
  );
}
