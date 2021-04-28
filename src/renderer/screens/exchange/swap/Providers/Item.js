// @flow

import React from "react";
import { Trans } from "react-i18next";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import InfoCircle from "~/renderer/icons/InfoCircle";

const Wrapper: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
}))`
  flex-direction: ${p => (p.rows ? "row" : "column")};
  align-items: center;
  justify-content: flex-start;
  align-self: stretch;
  border: 1px solid
    ${p => (p.selected ? p.theme.colors.palette.primary.main : p.theme.colors.palette.text.shade10)};
  ${p => (p.selected ? `box-shadow: 0px 0px 6px 0px ${p.theme.colors.palette.primary.main};` : "")}
  border-radius: 4px;
  margin-bottom: 16px;
  cursor: pointer;
`;
const Bullet = styled.div`
  background-color: ${p => p.theme.colors.palette.primary.main};
  margin-right: 8px;
  border-radius: 4px;
  align-self: center;
  height: 4px;
  width: 4px;
`;

const KYC = styled(Box)`
  background-color: ${p => p.theme.colors.palette.text.shade5};
  border-radius: 4px;
  padding: 6px 10px;
  margin-top: 4px;
  align-self: flex-start;
`;

const Item = ({
  id,
  selected,
  onSelect,
  Icon,
  title,
  bullets,
  kyc,
  rows,
}: {
  id: string,
  selected?: string,
  onSelect: string => void,
  Icon: any,
  title: React$Node,
  bullets: Array<React$Node>,
  kyc?: string,
  rows?: boolean,
}) => {
  return (
    <Wrapper onClick={() => onSelect(id)} selected={selected === id} horizontal={rows} p={16}>
      <Icon size={32} />
      <Box ml={rows ? 24 : 0}>
        <Text mb={rows ? 0 : 24} ff="Inter|SemiBold" fontSize={14} color="palette.text.shade100">
          {title}
        </Text>
        {kyc && rows ? (
          <KYC horizontal color="palette.text.shade70">
            <Text ff="Inter|SemiBold" mr={1} fontSize={10} color="palette.text.shade80">
              <Trans i18nKey={`swap.providers.kyc.status.${kyc}`} />
            </Text>
            <InfoCircle size={16} />
          </KYC>
        ) : null}
      </Box>
      <Box flex={1} alignItems="flex-start">
        {bullets.map((bullet, i) => (
          <Box horizontal alignItems={"center"} mb={1} key={i}>
            <Bullet />
            <Text style={{ flex: 1 }} ff="Inter|Medium" fontSize={12} color="palette.text.shade70">
              {bullet}
            </Text>
          </Box>
        ))}
      </Box>
      {kyc && !rows ? (
        <KYC horizontal color="palette.text.shade70" alignSelf="center">
          <Text ff="Inter|SemiBold" mr={1} fontSize={10} color="palette.text.shade80">
            <Trans i18nKey={`swap.providers.kyc.status.${kyc}`} />
          </Text>
          <InfoCircle size={16} />
        </KYC>
      ) : null}
    </Wrapper>
  );
};

export default Item;
