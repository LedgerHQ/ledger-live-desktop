import React from "react";
import { Trans } from "react-i18next";
import { Box, Text, Log, Flex, Button } from "@ledgerhq/react-ui";
import { FinalStepIllustration } from "./FinalStepIllustration";
import TranslatedError from "~/renderer/components/TranslatedError";
import SupportLinkError from "~/renderer/components/SupportLinkError";

type Props = {
  error: Error;
};

export function FinalStepVerificationError({ error }: Props) {
  return (
    <Flex flexDirection="column" justifyContent="center" flex={1} bg="error.c100" rowGap={12}>
      <Flex
        flexDirection="column"
        rowGap={8}
        alignSelf="stretch"
        justifyContent="center"
        alignItems="center"
      >
        <Box width="70%">
          <FinalStepIllustration />
        </Box>
        <Log extraTextProps={{ variant: "h5" }} width="60%">
          <TranslatedError error={error} />
        </Log>
        <Text>
          <TranslatedError error={error} field="description" />
          <SupportLinkError error={error} />
        </Text>
      </Flex>
    </Flex>
  );
}

type FooterProps = {
  onCancel: () => void;
  onRetry: () => void;
};

function Footer({ onCancel, onRetry }: FooterProps) {
  return (
    <>
      <Button onClick={onCancel} variant="main" outline>
        <Trans i18nKey="common.cancel" />
      </Button>
      <Button onClick={onRetry} variant="main">
        <Trans i18nKey="common.retry" />
      </Button>
    </>
  );
}

FinalStepVerificationError.Footer = Footer;
