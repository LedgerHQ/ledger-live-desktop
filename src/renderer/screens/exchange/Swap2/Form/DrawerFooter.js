// @flow

import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import { urls } from "~/config/urls";
import Box from "~/renderer/components/Box/Box";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import Text from "~/renderer/components/Text";
import { openURL } from "~/renderer/linking";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { Separator } from "./Separator";

const Terms: ThemedComponent<{}> = styled(Text).attrs({
  ff: "Inter|SemiBold",
  color: "palette.text.shade60",
  fontSize: 13,
})`
  white-space: pre-line;
`;

export function DrawerFooter({ provider }: { provider: string }) {
  const url = urls.swap.providers[provider]?.tos;
  const onLinkClick = useCallback(() => openURL(url), [url]);

  if (!url) {
    return null;
  }

  return (
    <>
      <Separator />
      <Box mx="7px" mb="7px">
        <Terms>
          <Trans
            i18nKey={"DeviceAction.swap.acceptTerms"}
            values={{ provider }}
            components={[
              <LinkWithExternalIcon
                key="termsExternalLink"
                fontSize={13}
                color="palette.text.shade60"
                onClick={onLinkClick}
                style={{ textDecoration: "underline" }}
              >
                <Text fontSize={13} color="palette.text.shade60" capitalize>
                  {provider}
                </Text>
              </LinkWithExternalIcon>,
            ]}
          />
        </Terms>
      </Box>
    </>
  );
}
