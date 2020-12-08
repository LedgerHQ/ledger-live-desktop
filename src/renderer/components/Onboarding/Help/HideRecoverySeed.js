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
  align-items: center;
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

const HideRecoverySeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 76px;
`;

export function HideRecoverySeed() {
  const { t } = useTranslation();

  return (
    <ScrollArea>
      <HideRecoverySeedContainer>
        <Text
          mb="32px"
          color="palette.text.shade100"
          ff="Inter|SemiBold"
          fontSize="22px"
          lineHeight="26.63px"
        >
          {t("onboarding.drawers.whereToHide.title")}
        </Text>
        <Point>{t("onboarding.drawers.whereToHide.points.1")}</Point>
        <Point>{t("onboarding.drawers.whereToHide.points.2")}</Point>
        <Point>{t("onboarding.drawers.whereToHide.points.3")}</Point>
        <Point>{t("onboarding.drawers.whereToHide.points.4")}</Point>
        <Point>{t("onboarding.drawers.whereToHide.points.5")}</Point>
      </HideRecoverySeedContainer>
    </ScrollArea>
  );
}
