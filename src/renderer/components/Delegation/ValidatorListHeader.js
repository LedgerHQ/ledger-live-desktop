// @flow
import React, { memo } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Check from "~/renderer/icons/Check";
import ExclamationCircle from "~/renderer/icons/ExclamationCircle";

const Separator = styled.div`
  margin: 0 10px;
  height: 13px;
  width: 1px;
  background-color: ${p => p.theme.colors.palette.text.shade60};
`;

type ValidatorListHeaderProps = {
  votesSelected: number,
  votesAvailable: number,
  max: number,
  maxText?: string,
  maxVotes: number,
  totalValidators: number,
  notEnoughVotes: boolean,
};

const ValidatorListHeader = ({
  votesSelected,
  votesAvailable,
  max,
  maxText,
  maxVotes,
  totalValidators,
  notEnoughVotes,
}: ValidatorListHeaderProps) => (
  <Box horizontal alignItems="center" justifyContent="space-between" py={2} px={3}>
    <Text fontSize={3} ff="Inter|Medium">
      <Trans i18nKey="vote.steps.castVotes.validators" values={{ total: totalValidators }} />
    </Text>
    <Box horizontal alignItems="center">
      {votesSelected === maxVotes ? (
        <Text fontSize={3} ff="Inter|Medium">
          <Trans i18nKey="vote.steps.castVotes.maxSelected" values={{ total: maxVotes }} />
        </Text>
      ) : (
        <Text fontSize={3} ff="Inter|Medium">
          <Trans i18nKey="vote.steps.castVotes.selected" values={{ total: votesSelected }} />
        </Text>
      )}
      <Separator />
      {max > 0 ? (
        <Text fontSize={3} ff="Inter|Medium">
          <Trans i18nKey="vote.steps.castVotes.votes" values={{ total: maxText || max }} />
        </Text>
      ) : notEnoughVotes ? (
        <Box horizontal alignItems="center" color="alertRed">
          <ExclamationCircle size={13} />
          <Box ml={1}>
            <Text fontSize={3} ff="Inter|Medium">
              <Trans i18nKey="vote.steps.castVotes.maxUsed" values={{ total: votesAvailable }} />
            </Text>
          </Box>
        </Box>
      ) : (
        <Box horizontal alignItems="center" color="positiveGreen">
          <Check size={13} />
          <Box ml={1}>
            <Text fontSize={3} ff="Inter|Medium">
              <Trans i18nKey="vote.steps.castVotes.allVotesAreUsed" />
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  </Box>
);

export default memo<ValidatorListHeaderProps>(ValidatorListHeader);
