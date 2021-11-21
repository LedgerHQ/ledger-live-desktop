import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Text, Flex, Icon, Switch } from "@ledgerhq/react-ui";

export const IllustrationContainer = styled(Flex)<{ src: string }>`
  background: url(${({ src }) => src}) no-repeat center;
  background-size: contain;
`;

export const Title = (props: any) => <Text variant="h2" mb={12} {...props} />;
export const SubTitle = (props: any) => (
  <Text variant="body" mb={2} color="palette.neutral.c80" {...props} />
);

export const BorderFlex = styled(Flex)`
  border: 1px solid ${p => p.theme.colors.palette.neutral.c40};
  border-radius: 4px;
`;

export const IconContainer = styled(BorderFlex).attrs({
  width: 60,
  height: 60,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
})``;

export const Row = styled(Flex).attrs({
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
})``;

export const Column = styled(Flex).attrs({
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "stretch",
})``;

export const Bullet = ({
  icon,
  bulletText,
  text,
  subText,
}: {
  icon?: string;
  bulletText?: string | number;
  text: string;
  subText?: string;
}) => {
  return (
    <Row mb={8}>
      <IconContainer>{icon ? <Icon name={icon} size={18} /> : bulletText}</IconContainer>
      <Column flex="1" ml={4}>
        <Text variant="body">{text}</Text>
        {subText && (
          <Text mt={2} variant="small" color="palette.neutral.c80">
            {subText}
          </Text>
        )}
      </Column>
    </Row>
  );
};

export const CheckStep = ({
  checked,
  label,
  ...props
}: {
  checked: boolean;
  label: React.ReactNode;
}) => (
  <BorderFlex mt={12} p={4} {...props}>
    <Switch name="checkbox" checked={checked} size="normal" />
    <Text ml={4} flex="1" variant="body">
      {label}
    </Text>
  </BorderFlex>
);

const Footer = styled(Column).attrs({ flex: "1", p: 8 })`
  border-top: 1px solid ${p => p.theme.colors.palette.primary.c100};
  cursor: pointer;
`;

export const AsideFooter = ({ text, ...props }: { text: string }) => {
  const { t } = useTranslation();
  return (
    <Footer {...props}>
      <Row mb={4}>
        <Text mr={2} variant="large">
          {t("common.needHelp")}
        </Text>
        <Icon name="LifeRing" size={18} />
      </Row>
      <Text variant="small">{text}</Text>
    </Footer>
  );
};
