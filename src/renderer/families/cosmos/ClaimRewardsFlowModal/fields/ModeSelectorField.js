// @flow
import React from "react";

import { Trans } from "react-i18next";

import Box from "~/renderer/components/Box";
import ToggleButton from "~/renderer/components/ToggleButton";
import InfoCircle from "~/renderer/icons/InfoCircle";
import Text from "~/renderer/components/Text";
import Popover from "~/renderer/components/Popover";

const options = [
  {
    value: "claimRewardCompound",
    label: <Trans i18nKey="cosmos.claimRewards.flow.steps.claimRewards.compound" />,
  },
  {
    value: "claimReward",
    label: <Trans i18nKey="cosmos.claimRewards.flow.steps.claimRewards.claim" />,
  },
];

export default function ModeSelectorField({
  mode,
  onChange,
}: {
  mode: string,
  onChange: (r: string) => void,
}) {
  return (
    <Box style={{ width: 300 }} alignSelf="center">
      <ToggleButton value={mode} options={options} onChange={onChange} />
      <Box horizontal alignItems="center" justifyContent="center" color="palette.text.shade60">
        <Popover
          position="right"
          content={
            <Box vertical px={2}>
              <Box vertical alignItems="start" justifyContent="start" my={2}>
                <Text ff="Inter|SemiBold" fontSize={4} color="palette.primary.main">
                  <Trans i18nKey="cosmos.claimRewards.flow.steps.claimRewards.compound" />
                </Text>
                <Text fontSize={3} textAlign="left" color="palette.text.shade80">
                  <Trans i18nKey="cosmos.claimRewards.flow.steps.claimRewards.compoundDescription" />
                </Text>
              </Box>

              <Box vertical alignItems="start" justifyContent="start" my={2}>
                <Text ff="Inter|SemiBold" fontSize={4} color="palette.primary.main">
                  <Trans i18nKey="cosmos.claimRewards.flow.steps.claimRewards.claim" />
                </Text>
                <Text fontSize={3} textAlign="left" color="palette.text.shade80">
                  <Trans i18nKey="cosmos.claimRewards.flow.steps.claimRewards.claimDescription" />
                </Text>
              </Box>
            </Box>
          }
        >
          <Box horizontal alignItems="center" p={2} justifyContent="center">
            <Text ff="Inter|SemiBold" fontSize={4}>
              <Trans i18nKey="cosmos.claimRewards.flow.steps.claimRewards.compoundOrClaim" />
            </Text>
            <Box ml={1}>
              <InfoCircle size={16} />
            </Box>
          </Box>
        </Popover>
      </Box>
    </Box>
  );
}
