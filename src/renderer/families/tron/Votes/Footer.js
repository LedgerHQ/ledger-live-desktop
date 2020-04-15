// @flow

import React from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box/Box";
import Button from "~/renderer/components/Button";
import ProgressCircle from "~/renderer/components/ProgressCircle";
import { useDiscreetMode } from "~/renderer/components/Discreet";

export const Wrapper: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: row;
  padding: 16px 20px;
  border-bottom: 1px solid ${p => p.theme.colors.palette.divider};
`;

export const TableLine: ThemedComponent<{}> = styled(Text).attrs(() => ({
  ff: "Inter|SemiBold",
  color: "palette.text.shade60",
  fontSize: 3,
}))`
  flex: 1.25;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  justify-content: flex-start;
  &:last-child {
    flex: 0.5;
  }
`;

type Props = {
  total: number,
  used: number,
  onClick: () => void,
};

const Footer = ({ total, used, onClick }: Props) => {
  const discreet = useDiscreetMode();

  const percentVotesUsed = Math.floor(100 * (used / total)) / 100;

  if (percentVotesUsed >= 1) return null;

  return (
    <Box bg="palette.action.hover" horizontal alignItems="center" px={4} py={2}>
      <ProgressCircle size={50} progress={percentVotesUsed} />
      <Box vertical ml={2}>
        <Text ff="Inter|SemiBold" fontSize={3} color="palette.text.shade100">
          <Trans
            i18nKey="tron.voting.remainingVotes.title"
            values={{ amount: !discreet ? total - used : "***" }}
          />
        </Text>
        <Text ff="Inter|Medium" fontSize={3} color="palette.text.shade60">
          <Trans i18nKey="tron.voting.remainingVotes.description" />
        </Text>
      </Box>
      <Box flex="1" />
      <Button primary onClick={onClick}>
        <Trans i18nKey="tron.voting.remainingVotes.button" />
      </Button>
    </Box>
  );
};

export default Footer;
