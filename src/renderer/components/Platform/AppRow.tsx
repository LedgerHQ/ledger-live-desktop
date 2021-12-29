import { AppManifest } from "@ledgerhq/live-common/lib/platform/types";
import React, { useCallback, useMemo } from "react";
import styled, { css } from "styled-components";
import { Box, Flex, Text } from "@ledgerhq/react-ui";
import LiveAppIcon from "../WebPlatformPlayer/LiveAppIcon";
import CryptoCurrencyIcon from "../CryptoCurrencyIcon";
import { listSupportedCurrencies } from "@ledgerhq/live-common/lib/currencies";
import { CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import { useTranslation } from "react-i18next";

const Container = styled(Flex).attrs({
  borderRadius: "8px",
  alignSelf: "stretch",
  flexDirection: "row",
  alignItems: "center",
  p: "16px",
  columnGap: "16px",
})<{ disabled?: boolean }>`
  --background-color: ${p => p.theme.colors.neutral.c30};
  background-color: var(--background-color);
  ${p =>
    p.disabled
      ? css`
          opacity: 0.6;
        `
      : css`
          cursor: pointer;
          :hover {
            --background-color: ${p => p.theme.colors.neutral.c20};
          }
        `}
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

const Title = styled(Text).attrs({
  variant: "body",
  fontWeight: "semiBold",
  fontSize: "14px",
  lineHeight: "17px",
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
  border: 2px solid var(--background-color);
  border-radius: 20px;
`;

type Props = {
  manifest: AppManifest;
  onClick: (manifest: AppManifest) => any;
};

const AppRow: React.FC<Props> = ({ manifest, onClick }: Props) => {
  const {
    icon,
    name,
    branch,
    params: { networks } = {},
    categories: [category],
    content: {
      description: { en: description },
    },
  } = manifest;

  const isDisabled = branch === "soon";
  const showBranchTag = branch !== "stable";

  const { t } = useTranslation();

  const handleClick = useCallback(() => {
    if (!isDisabled) onClick(manifest);
  }, [manifest, onClick, isDisabled]);

  const networksCurrencies: CryptoCurrency[] = useMemo(() => {
    const currencies = listSupportedCurrencies();
    return networks ? networks.map(({ currency }) => currencies.find(c => c.id === currency)) : [];
  }, [networks]);

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
          <Title>{name}</Title>
          <CurrencyIconsContainer>
            {networksCurrencies.map((currency: CryptoCurrency) => {
              return (
                currency && (
                  <CurrencyIconContainer>
                    <CryptoCurrencyIcon key={currency.id} circle currency={currency} size={18} />
                  </CurrencyIconContainer>
                )
              );
            })}
          </CurrencyIconsContainer>
        </TitleContainer>
        <Description>{description}</Description>
      </LeftContainer>
      <TagContainer {...tagProps}>
        <TagText {...tagProps}>{tagContent}</TagText>
      </TagContainer>
    </Container>
  );
};

export default AppRow;
