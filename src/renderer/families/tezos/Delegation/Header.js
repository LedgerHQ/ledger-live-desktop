// @flow

import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Text from "~/renderer/components/Text";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import { rgba } from "~/renderer/styles/helpers";

const Wrapper: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 20px;
  border-bottom: 1px solid ${p => p.theme.colors.palette.divider};
  background-color: ${p => rgba(p.theme.colors.palette.secondary.main, 0.02)};
  > * {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
  }

  > *:first-of-type,
  > *:nth-of-type(2) {
    flex: 1.5;
  }

  > *:last-of-type {
    flex: 0.5;
  }
`;

const Header = () => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <Text ff="Inter|SemiBold" color="palette.text.shade60" fontSize={3}>
        {t("delegation.validator")}
      </Text>
      <Text ff="Inter|SemiBold" color="palette.text.shade60" fontSize={3}>
        {t("delegation.transactionID")}
      </Text>
      <Text ff="Inter|SemiBold" color="palette.text.shade60" fontSize={3}>
        {t("delegation.amount")}
      </Text>
      <Text ff="Inter|SemiBold" color="palette.text.shade60" fontSize={3}>
        {t("delegation.value")}
      </Text>
      <Text ff="Inter|SemiBold" color="palette.text.shade60" fontSize={3}>
        {t("delegation.duration")}
      </Text>
      <Text />
    </Wrapper>
  );
};

export default Header;
