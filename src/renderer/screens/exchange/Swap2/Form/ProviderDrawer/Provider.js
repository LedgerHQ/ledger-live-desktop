// @flow
import React from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Lock from "~/renderer/icons/Lock";
import type { FakeProvider } from "./index";
import { rgba } from "~/renderer/styles/helpers";

const ProviderContainer: ThemedComponent<{}> = styled(Box).attrs({
  horizontal: true,
  alignItems: "center",
  ff: "Inter|SemiBold",
})`
  border: 1px solid ${p => p.theme.colors.palette.divider};
  border-radius: 4px;
  cursor: pointer;
  ${p =>
    p.selected
      ? `
    border-color: ${p.theme.colors.palette.primary.main};
    box-shadow: 0px 0px 0px 4px ${rgba(p.theme.colors.palette.primary.main, 0.3)};
    `
      : `
    :hover {
      box-shadow: 0px 0px 2px 1px ${p.theme.colors.palette.divider};
    }`}
`;

const ChainTag = styled.div`
  padding: 3px 6px;
  background: rgba(20, 37, 51, 0.06);
  border-radius: 4px;
  font-weight: 600;
  font-size: 9px;
  color: rgba(20, 37, 51, 0.3);
  margin-left: 4px;
`;

export type Props = {
  provider: FakeProvider,
  onSelect: FakeProvider => void,
  selected?: boolean,
};

function Provider({ provider, selected, onSelect }: Props) {
  const handleSelection = React.useCallback(() => onSelect(provider), [provider, onSelect]);

  return (
    <ProviderContainer padding={3} marginBottom={3} selected={selected} onClick={handleSelection}>
      <Box marginRight="12px">
        <provider.iconComponent size={28} />
      </Box>
      <Box flex={1}>
        <Box horizontal justifyContent="space-between" color="palette.text" fontWeight="600">
          <Box horizontal alignItems="center">
            <Text capitalize fontSize="14px">
              {provider.provider}
            </Text>
            <ChainTag>
              {provider.onChain ? (
                <Trans i18nKey="swap2.form.providerDrawer.onChain" />
              ) : (
                <Trans i18nKey="swap2.form.providerDrawer.offChain" />
              )}
            </ChainTag>
          </Box>
          <Text fontSize="18px">
            {provider.amount} {provider.fromUnit}
          </Text>
        </Box>
        <Box
          horizontal
          justifyContent="space-between"
          color="palette.text.shade50"
          fontSize="12px"
          fontWeight="500"
        >
          <Box horizontal>
            {provider.tradeMethod === "fixed" && (
              <Box marginRight={1}>
                <Lock size={16} />
              </Box>
            )}
            <Text>
              1 {provider.fromUnit} = {provider.rate} {provider.toUnit}
            </Text>
          </Box>
          <Text>
            {provider.fiatUnit}
            {provider.value}
          </Text>
        </Box>
      </Box>
    </ProviderContainer>
  );
}

export default React.memo<Props>(Provider);
