// @flow
import invariant from "invariant";
import React, { useMemo, useCallback } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";

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
  type: "text",
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
`;

type SRRowProps = {
  sr: SuperRepresentative,
  rank: number,
  isSR?: boolean,
  value?: number,
  disabled?: boolean,
  onChange: (vote: number) => void,
  onExternalLink: (address: string) => void,
};

const SRRow = ({ sr, rank, isSR, value, disabled, onChange, onExternalLink }: SRRowProps) => (
  <Row disabled={value && disabled} active={!!value}>
    <IconContainer isSR={isSR}>{isSR ? <Trophy size={16} /> : <Medal size={16} />}</IconContainer>
    <InfoContainer>
      <Title onClick={() => onExternalLink(sr.address)}>
        <Text>{sr.name}</Text>
        <IconContainer>
          <ExternalLink size={16} />
        </IconContainer>
      </Title>
      <SubTitle>
        <Trans i18nKey="vote.steps.castVotes.rank" values={{ rank }}>
          <b></b>
        </Trans>
        {/** @TODO add estimated yield here */}
      </SubTitle>
    </InfoContainer>
    <Box flex="1" />
    <InputBox active={!!value}>
      <IconContainer onClick={() => onChange(0)}>
        <Cross size={16} />
      </IconContainer>
      <VoteInput value={value} disabled={disabled} onChange={e => onChange(e.target.value)} />
    </InputBox>
  </Row>
);

const SR_THRESHOLD = 27;

type Props = {
  votes: Vote[],
  account: Account,
  transaction: ?Transaction,
  status: TransactionStatus,
  onChangeVotes: (votes: Vote[]) => void,
  bridgePending: boolean,
};

const AmountField = ({ account, onChangeVotes, transaction, status, bridgePending }: Props) => {
  invariant(account && transaction, "account and transaction required");

  const explorerView = getDefaultExplorerView(account.currency);

  const { votes } = transaction;

  const formattedVotes = useMemo(
    () => votes.reduce((sum, { voteCount, address }) => ({ ...sum, [address]: voteCount }), {}),
    [votes],
  );

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

  if (!status) return null;

  return (
    <ScrollContainer>
      {SR.map(({ sr, rank, isSR }, i) => (
        <SRRow
          key={`SR_${sr.address}_${i}`}
          sr={sr}
          rank={rank}
          isSR={isSR}
          value={formattedVotes[sr.address]}
          onChange={() => {}}
          onExternalLink={() => onExternalLink(sr.address)}
        />
      ))}
    </ScrollContainer>
  );
};

export default AmountField;
