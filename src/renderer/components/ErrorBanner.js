// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";
import IconTriangleWarning from "~/renderer/icons/TriangleWarning";
import TranslatedError from "./TranslatedError";
import SupportLinkError from "./SupportLinkError";

type Props = {
  error: Error,
  warning?: boolean,
};

const ErrorBannerBox: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: "flex-start",
  color: "palette.background.paper",
  borderRadius: 1,
  fontSize: 1,
  px: 4,
  py: 2,
  mb: 4,
}))`
  background-color: ${p => (p.warning ? p.theme.colors.orange : p.theme.colors.alertRed)};
`;

class ErrorBanner extends PureComponent<Props> {
  render() {
    const { error, warning } = this.props;
    return (
      <ErrorBannerBox warning={warning}>
        <Box mr={2} alignSelf="center">
          <IconTriangleWarning height={16} width={16} />
        </Box>
        <Box ff="Inter|SemiBold" fontSize={3} vertical shrink>
          <Box>
            <TranslatedError error={error} />
          </Box>
          <Box>
            <TranslatedError error={error} field="description" />
          </Box>
          <SupportLinkError error={error} />
        </Box>
      </ErrorBannerBox>
    );
  }
}
export default ErrorBanner;
