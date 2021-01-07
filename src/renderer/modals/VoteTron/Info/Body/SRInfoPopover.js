// @flow
import React from "react";

import { Trans } from "react-i18next";

import Box from "~/renderer/components/Box";
import Popover from "~/renderer/components/Popover";
import Text from "~/renderer/components/Text";
import InfoCircle from "~/renderer/icons/InfoCircle";

export default function SRInfoPopover({ ...props }: *) {
  return (
    <Box
      horizontal
      alignItems="center"
      justifyContent="center"
      color="palette.text.shade60"
      {...props}
    >
      <Popover
        position="right"
        content={
          <Box vertical px={2}>
            <Box vertical alignItems="start" justifyContent="start" my={2}>
              <Text ff="Inter|SemiBold" fontSize={4} color="palette.primary.main">
                <Trans i18nKey="tron.manage.vote.steps.vote.info.superRepresentative.title" />
              </Text>

              <Text fontSize={3} textAlign="left" color="palette.text.shade80">
                <Trans i18nKey="tron.manage.vote.steps.vote.info.superRepresentative.description" />
              </Text>
            </Box>

            <Box vertical alignItems="start" justifyContent="start" my={2}>
              <Text ff="Inter|SemiBold" fontSize={4} color="palette.primary.main">
                <Trans i18nKey="tron.manage.vote.steps.vote.info.candidates.title" />
              </Text>

              <Text fontSize={3} textAlign="left" color="palette.text.shade80">
                <Trans i18nKey="tron.manage.vote.steps.vote.info.candidates.description" />
              </Text>
            </Box>
          </Box>
        }
      >
        <Box horizontal alignItems="center" p={2} justifyContent="center">
          <Text ff="Inter|SemiBold" fontSize={3}>
            <Trans i18nKey="tron.manage.vote.steps.vote.info.message" />
          </Text>

          <Box ml={1}>
            <InfoCircle size={12} />
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}
