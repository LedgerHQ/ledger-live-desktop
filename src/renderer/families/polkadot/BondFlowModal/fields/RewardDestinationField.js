// @flow
import React, { useCallback } from "react";

import { Trans } from "react-i18next";

import Box from "~/renderer/components/Box";
import ToggleButton from "~/renderer/components/ToggleButton";
import InfoCircle from "~/renderer/icons/InfoCircle";
import Text from "~/renderer/components/Text";
import Popover from "~/renderer/components/Popover";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";

const options = [
  {
    value: "Stash",
    label: <Trans i18nKey="polkadot.bond.rewardDestination.stash" />,
  },
  {
    value: "Staked",
    label: <Trans i18nKey="polkadot.bond.rewardDestination.staked" />,
  },
];

export default function ResourceField({
  rewardDestination,
  onChange,
}: {
  rewardDestination: string,
  onChange: (r: string) => void,
}) {
  const onLearnMore = useCallback(() => openURL(urls.stakingPolkadot), []);

  return (
    <Box style={{ width: 300 }} alignSelf="center" mb={2}>
      <Box horizontal alignItems="center" justifyContent="center" color="palette.text.shade60">
        <Popover
          position="right"
          content={
            <Box vertical px={2}>
              <Box vertical alignItems="start" justifyContent="start" my={2}>
                <Text ff="Inter|SemiBold" fontSize={4} color="palette.primary.main">
                  <Trans i18nKey="polkadot.bond.rewardDestination.stash" />
                </Text>
                <Text fontSize={3} textAlign="left" color="palette.text.shade80">
                  <Trans i18nKey="polkadot.bond.rewardDestination.stashDescription" />
                </Text>
              </Box>

              <Box vertical alignItems="start" justifyContent="start" my={2}>
                <Text ff="Inter|SemiBold" fontSize={4} color="palette.primary.main">
                  <Trans i18nKey="polkadot.bond.rewardDestination.staked" />
                </Text>
                <Text fontSize={3} textAlign="left" color="palette.text.shade80">
                  <Trans i18nKey="polkadot.bond.rewardDestination.stakedDescription" />
                </Text>
              </Box>

              <Box vertical alignItems="start" justifyContent="start" my={2}>
                <Text ff="Inter|SemiBold" fontSize={4} color="palette.primary.main">
                  <Trans i18nKey="polkadot.bond.rewardDestination.optionTitle" />
                </Text>
                <Text fontSize={3} textAlign="left" color="palette.text.shade80">
                  <Trans i18nKey="polkadot.bond.rewardDestination.optionDescription" />
                </Text>
                <LinkWithExternalIcon
                  label={<Trans i18nKey="common.learnMore" />}
                  onClick={onLearnMore}
                />
              </Box>
            </Box>
          }
        >
          <Box horizontal alignItems="center" p={2} justifyContent="center">
            <Text ff="Inter|SemiBold" fontSize={4}>
              <Trans i18nKey="polkadot.bond.rewardDestination.label" />
            </Text>
            <Box ml={1}>
              <InfoCircle size={16} />
            </Box>
          </Box>
        </Popover>
      </Box>
      <ToggleButton value={rewardDestination} options={options} onChange={onChange} />
    </Box>
  );
}
