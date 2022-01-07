import React, { memo, useCallback } from "react";
import { AppManifest, AppMetadata } from "@ledgerhq/live-common/lib/platform/types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Box, Flex, Text } from "@ledgerhq/react-ui";
import LiveAppIcon from "../WebPlatformPlayer/LiveAppIcon";
import CryptoCurrencyIcon from "../CryptoCurrencyIcon";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import AppName from "./AppName";
import { containerButtonCSS, getBackgroundColor } from "./styles";

const Container = styled(Flex).attrs({
  borderRadius: "8px",
  alignSelf: "stretch",
  flexDirection: "row",
  alignItems: "center",
  p: "16px",
  columnGap: "16px",
})<{ disabled?: boolean }>`
  ${containerButtonCSS};
`;

const LeftContainer = styled(Flex).attrs({
  flexDirection: "column",
  rowGap: "6px",
  flex: 1,
})``;

const TitleContainer = styled(Flex).attrs({
  flexDirection: "row",
  alignItems: "center",
  columnGap: "6px",
})``;

const Description = styled(Text).attrs({
  variant: "small",
  fontWeight: "medium",
  fontSize: "12px",
  lineHeight: "15px",
  color: "neutral.c70",
  flexShrink: 1,
  mr: "30px",
})`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

type TagProps = {
  highlight?: boolean;
  disabled?: boolean;
};

/* TODO at some point: reuse react-ui's Tag, it's just not working properly in pre-v3 environment */
const TagContainer = styled(Flex).attrs((p: TagProps) => ({
  padding: "3px 5px",
  backgroundColor: p.highlight ? "primary.c90" : p.disabled ? "neutral.c50" : "",
  border: "1px solid",
  borderColor: p.highlight ? "primary.c90" : p.disabled ? "neutral.c50" : "neutral.c70",
  borderRadius: "4px",
}))<TagProps>``;

/* TODO at some point: reuse react-ui's Tag, it's just not working properly in pre-v3 environment */
const TagText = styled(Text).attrs((p: TagProps) => ({
  variant: "tiny",
  fontWeight: "semiBold",
  fontSize: "10px",
  lineHeight: "12px",
  color: p.highlight || p.disabled ? "neutral.c30" : "neutral.c70",
  uppercase: true,
}))``;

const CurrencyIconsContainer = styled(Flex).attrs({
  ml: "5px",
})``;

const CurrencyIconContainer = styled(Box).attrs({
  my: "-2px",
  ml: "-5px",
})`
  border: 2px solid ${p => getBackgroundColor(p.theme)};
  border-radius: 20px;
`;

type Props = {
  manifest: AppManifest;
  appMetadata?: AppMetadata;
  onClick: (manifest: AppManifest) => any;
};

const AppRow: React.FC<Props> = ({ manifest, appMetadata, onClick }: Props) => {
  const {
    icon,
    name,
    branch,
    content: {
      description: { en: description },
    },
  } = manifest;

  const { category } = appMetadata || {};

  /**
   * For now this feature (displaying networks icons) is put on hold but I will
   * leave this here so it can be reimplemented easily when the spec gets clarified.
   * Otherwise, networks is an array of string identifying cryptocurrencies.
   * It should come either from appMetadata.networks or from manifest.currencies
   */
  const networks: string[] = [];
  const networksCurrencies: CryptoCurrency[] = networks
    ? networks.map(network => getCryptoCurrencyById(network))
    : [];

  const isDisabled = branch === "soon";
  const showBranchTag = branch !== "stable";

  const { t } = useTranslation();

  const handleClick = useCallback(() => {
    if (!isDisabled) onClick(manifest);
  }, [manifest, onClick, isDisabled]);

  const tagContent = showBranchTag ? t(`platform.catalog.branch.${manifest.branch}`) : category;
  const tagProps = {
    disabled: isDisabled,
    highlight: branch === "experimental",
  };

  return (
    <Container disabled={isDisabled} onClick={handleClick}>
      <LiveAppIcon icon={icon || undefined} name={name} size={40} />
      <LeftContainer>
        <TitleContainer>
          <AppName>{name}</AppName>
          {networksCurrencies.length > 0 && (
            <CurrencyIconsContainer>
              {networksCurrencies.map((currency: CryptoCurrency) => {
                return (
                  currency && (
                    <CurrencyIconContainer>
                      <CryptoCurrencyIcon
                        key={currency.id}
                        circle
                        currency={currency}
                        size={18}
                        circleOverrideIconColor="white"
                      />
                    </CurrencyIconContainer>
                  )
                );
              })}
            </CurrencyIconsContainer>
          )}
        </TitleContainer>
        <Description>{description}</Description>
      </LeftContainer>
      {tagContent && (
        <TagContainer {...tagProps}>
          <TagText {...tagProps}>{tagContent}</TagText>
        </TagContainer>
      )}
    </Container>
  );
};

export default memo(AppRow);
