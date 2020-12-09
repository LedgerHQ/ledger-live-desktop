// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import Text from "~/renderer/components/Text";
import styled from "styled-components";
import { ScrollArea } from "~/renderer/components/Onboarding/ScrollArea";
import ChevronRight from "~/renderer/icons/ChevronRight";

const PointContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
`;

const PointIconContainer = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #6490f1;
  background-color: #6490f110;
`;

type PointProps = {
  children: string,
};

function Point({ children }: PointProps) {
  return (
    <PointContainer>
      <PointIconContainer>
        <ChevronRight size={12} />
      </PointIconContainer>
      <Text
        ml="16px"
        color="palette.text.shade100"
        ff="Inter|Regular"
        fontSize="14px"
        lineHeight="21px"
        style={{ flex: 1 }}
      >
        {children}
      </Text>
    </PointContainer>
  );
}

const PinHelpContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 76px;
`;

export function RecoverySeed() {
  const { t } = useTranslation();

  return (
    <ScrollArea>
      <PinHelpContainer>
        <Text
          color="palette.text.shade100"
          ff="Inter|SemiBold"
          fontSize="22px"
          lineHeight="26.63px"
        >
          {t("onboarding.drawers.recoverySeed.title1")}
        </Text>
        <Text
          mt="8px"
          color="palette.text.shade100"
          ff="Inter|Regular"
          fontSize="14px"
          lineHeight="19.5px"
        >
          {t("onboarding.drawers.recoverySeed.paragraph1")}
        </Text>
        <Text
          mt="8px"
          color="palette.text.shade100"
          ff="Inter|Regular"
          fontSize="14px"
          lineHeight="19.5px"
        >
          {t("onboarding.drawers.recoverySeed.paragraph2")}
        </Text>
        <Text
          mt="8px"
          color="palette.text.shade100"
          ff="Inter|Regular"
          fontSize="14px"
          lineHeight="19.5px"
        >
          {t("onboarding.drawers.recoverySeed.link")}
        </Text>
        <Text
          mt="40px"
          color="palette.text.shade100"
          ff="Inter|SemiBold"
          fontSize="22px"
          lineHeight="26.63px"
        >
          {t("onboarding.drawers.recoverySeed.title2")}
        </Text>
        <Text
          mt="8px"
          mb="32px"
          color="palette.text.shade100"
          ff="Inter|Regular"
          fontSize="14px"
          lineHeight="19.5px"
        >
          {t("onboarding.drawers.recoverySeed.paragraph3")}
        </Text>
        <Point>{t("onboarding.drawers.recoverySeed.points.1")}</Point>
        <Point>{t("onboarding.drawers.recoverySeed.points.2")}</Point>
        <Point>{t("onboarding.drawers.recoverySeed.points.3")}</Point>
      </PinHelpContainer>
    </ScrollArea>
  );
}
