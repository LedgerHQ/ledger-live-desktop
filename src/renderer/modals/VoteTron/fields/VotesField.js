// @flow
import invariant from "invariant";
import React, { useMemo, useCallback, useState, useRef } from "react";
import { Trans } from "react-i18next";
import styled, { css } from "styled-components";

import { useTronSuperRepresentatives } from "@ledgerhq/live-common/lib/families/tron/react";
import { getDefaultExplorerView, getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { Account, TransactionStatus } from "@ledgerhq/live-common/lib/types";

import type {
  Transaction,
  Vote,
  SuperRepresentative,
} from "@ledgerhq/live-common/lib/families/tron/types";

import { openURL } from "~/renderer/linking";
import Box from "~/renderer/components/Box";
import Trophy from "~/renderer/icons/Trophy";
import Medal from "~/renderer/icons/Medal";
import Text from "~/renderer/components/Text";
import ExternalLink from "~/renderer/icons/ExternalLink";
import Cross from "~/renderer/icons/Cross";
import Check from "~/renderer/icons/Check";
import { useThrottledCallback } from "~/renderer/hooks/useDebounce";
import ExclamationCircle from "~/renderer/icons/ExclamationCircle";

const ScrollContainer: ThemedComponent<{}> = styled(Box).attrs(p => ({
  vertical: true,
  flex: 1,
  pl: p.theme.overflow.trackSize,
}))`
  ${p => p.theme.overflow.yAuto};
  max-height: 300px;
`;

const Row: ThemedComponent<{ active: boolean, disabled: boolean }> = styled(Box).attrs(() => ({
  horizontal: true,
  flex: "0 0 56px",
  mb: 2,
  alignItems: "center",
  justifyContent: "flex-start",
  p: 2,
}))`
  border-radius: 4px;
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
  border-color: ${p =>
    p.active ? p.theme.colors.palette.primary.main : p.theme.colors.palette.divider};
  ${p =>
    p.active
      ? `&:before {
        content: "";
        width: 4px;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;
        background-color: ${p.theme.colors.palette.primary.main};
      }`
      : ""}
  ${p =>
    p.disabled
      ? css`
          ${InputBox} {
            pointer-events: none;
          }
        `
      : ""}
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: ${p =>
    p.isSR ? p.theme.colors.palette.action.hover : p.theme.colors.palette.divider};
  color: ${p =>
    p.isSR ? p.theme.colors.palette.primary.main : p.theme.colors.palette.text.shade60};
`;

const InfoContainer = styled(Box).attrs(() => ({
  vertical: true,
  ml: 2,
  flex: 1,
}))``;

const Title = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: "center",
}))`
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  color: ${p => p.theme.colors.palette.text.shade100};
  ${IconContainer} {
    background-color: rgba(0, 0, 0, 0);
    color: ${p => p.theme.colors.palette.primary.main};
    opacity: 0;
  }
  &:hover {
    color: ${p => p.theme.colors.palette.primary.main};
  }
  &:hover > ${IconContainer} {
    opacity: 1;
  }
  ${Text} {
    flex: 0 1 auto;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const SubTitle = styled(Box).attrs(() => ({
  horizontal: true,
}))`
  font-size: 11px;
  font-weight: 500;
  color: ${p => p.theme.colors.palette.text.shade60};
`;

const InputBox = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: "center",
}))`
  flex-basis: 150px;
  border: 1px solid transparent;
  border-color: ${p =>
    p.active ? p.theme.colors.palette.primary.main : p.theme.colors.palette.divider};
  border-radius: 4px;
  height: 32px;
  padding: 2px 0;
  transition all 200ms ease-in;
  ${IconContainer} {
    opacity: 0;
    background-color: rgba(0,0,0,0);
    flex: 0 0 24px;
    cursor: pointer;
  }
  &:hover > ${IconContainer} {
    opacity: 1;
  }
  &:focus, &:focus-within {
    color: ${p => p.theme.colors.palette.primary.main};
    border-color: ${p => p.theme.colors.palette.primary.main};
  }
`;

const VoteInput = styled.input.attrs(() => ({
  type: "number",
  step: 1,
  min: 0,
  pattern: "[0-9]",
  placeholder: 0,
}))`
  flex: 1;
  text-align: right;
  border: none;
  height: 100%;
  padding: 0 6px;
  transition all 200ms ease-in;
  background-color: rgba(0,0,0,0);
`;

const Separator = styled.div`
  margin: 0 10px;
  height: 13px;
  width: 1px;
  background-color: ${p => p.theme.colors.palette.text.shade60};
`;

type SRRowProps = {
  sr: SuperRepresentative,
  rank: number,
  isSR?: boolean,
  value?: number,
  disabled?: boolean,
  max: number,
  onChange: (address: string, vote: number) => void,
  onExternalLink: (address: string) => void,
};

const SRRow = ({ sr, rank, isSR, value, disabled, max, onChange, onExternalLink }: SRRowProps) => {
  const inputRef = useRef();
  const onReset = useCallback(() => {
    onChange(sr.address, 0);
    if (inputRef.current) inputRef.current.value = 0;
  }, [onChange, inputRef, sr.address]);

  return (
    <Row disabled={!value && disabled} active={!!value}>
      <IconContainer isSR={isSR}>{isSR ? <Trophy size={16} /> : <Medal size={16} />}</IconContainer>
      <InfoContainer>
        <Title onClick={() => onExternalLink(sr.address)}>
          <Text>{`${rank}. ${sr.name || sr.address}`}</Text>
          <IconContainer>
            <ExternalLink size={16} />
          </IconContainer>
        </Title>
        <SubTitle>
          <Trans i18nKey="vote.steps.castVotes.totalVotes" values={{ total: sr.voteCount }}>
            <b></b>
          </Trans>
          {/** @TODO add estimated yield here */}
        </SubTitle>
      </InfoContainer>
      <InputBox active={!!value}>
        <IconContainer onClick={onReset}>
          <Cross size={16} />
        </IconContainer>
        <VoteInput
          /** $FlowFixMe */
          ref={inputRef}
          defaultValue={value}
          disabled={!value && disabled}
          min={0}
          {...(max > 0 ? { max } : {})}
          onChange={e => onChange(sr.address, e.target.value)}
        />
      </InputBox>
    </Row>
  );
};

const SR_THRESHOLD = 27;
const SR_MAX_VOTES = 5;

type Props = {
  votes: Vote[],
  account: Account,
  transaction: ?Transaction,
  status: TransactionStatus,
  onChangeVotes: (votes: Vote[]) => void,
  bridgePending: boolean,
};

const AmountField = ({ account, onChangeVotes, transaction, status, bridgePending }: Props) => {
  invariant(account && transaction && account.tronResources, "account and transaction required");

  const formattedVotes = useMemo(
    () =>
      transaction.votes.reduce(
        (sum, { voteCount, address }) => ({ ...sum, [address]: voteCount }),
        {},
      ),
    [transaction.votes],
  );

  const [votes, setVotes] = useState(formattedVotes);

  const explorerView = getDefaultExplorerView(account.currency);

  const { tronResources } = account;

  const votesAvailable = useMemo(() => (tronResources ? tronResources.tronPower : 0), [
    tronResources,
  ]);

  const votesUsed = Object.values(votes).reduce((sum, voteCount) => sum + Number(voteCount), 0);

  const max = Math.max(0, votesAvailable - votesUsed);

  const superRepresentatives = useTronSuperRepresentatives();
  const SR = useMemo(
    () =>
      superRepresentatives.map((sr, rank) => ({ sr, rank: rank + 1, isSR: rank <= SR_THRESHOLD })),
    [superRepresentatives],
  );

  const onExternalLink = useCallback(
    (address: string) => {
      const srURL = explorerView && getAddressExplorer(explorerView, address);

      if (srURL) openURL(srURL);
    },
    [explorerView],
  );

  const onUpdateVote = useThrottledCallback((address: string, count: number) => {
    const newVotes = votes;

    newVotes[address] = parseInt(Number(count));

    if (count <= 0 || Object.keys(newVotes).length > SR_MAX_VOTES) delete newVotes[address];

    setVotes(newVotes);
    onChangeVotes(
      Object.entries(newVotes).map(([address, voteCount]) => ({
        address,
        voteCount: Number(voteCount),
      })),
    );
  }, 100);

  if (!status) return null;

  const error = Object.values(status.errors)[0];

  return (
    <>
      <Box horizontal alignItems="center" justifyContent="space-between" py={2} px={3}>
        <Text fontSize={3} ff="Inter|Medium">
          <Trans i18nKey="vote.steps.castVotes.validators" values={{ total: SR.length }} />
        </Text>
        <Box horizontal alignItems="center">
          {Object.keys(votes).length === SR_MAX_VOTES ? (
            <Text fontSize={3} ff="Inter|Medium">
              <Trans i18nKey="vote.steps.castVotes.maxSelected" values={{ total: SR_MAX_VOTES }} />
            </Text>
          ) : (
            <Text fontSize={3} ff="Inter|Medium">
              <Trans
                i18nKey="vote.steps.castVotes.selected"
                values={{ total: Object.keys(votes).length }}
              />
            </Text>
          )}
          <Separator />
          {max > 0 ? (
            <Text fontSize={3} ff="Inter|Medium">
              <Trans i18nKey="vote.steps.castVotes.votes" values={{ total: max }} />
            </Text>
          ) : error ? (
            <Box horizontal alignItems="center" color="alertRed">
              <ExclamationCircle size={13} />
              <Box ml={1}>
                <Text fontSize={3} ff="Inter|Medium">
                  <Trans
                    i18nKey="vote.steps.castVotes.maxUsed"
                    values={{ total: votesAvailable }}
                  />
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
      <ScrollContainer>
        {SR.map(({ sr, rank, isSR }, i) => (
          <SRRow
            key={`SR_${sr.address}_${i}`}
            sr={sr}
            rank={rank}
            isSR={isSR}
            value={votes[sr.address]}
            onChange={onUpdateVote}
            onExternalLink={onExternalLink}
            disabled={max <= 0 || Object.keys(votes).length >= SR_MAX_VOTES}
            max={max + votes[sr.address]}
          />
        ))}
      </ScrollContainer>
    </>
  );
};

export default AmountField;
