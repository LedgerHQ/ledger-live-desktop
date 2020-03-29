// @flow
import invariant from "invariant";
import React, { useMemo, useCallback, useState, useRef, useEffect, memo, useReducer } from "react";
import { Trans } from "react-i18next";
import styled, { css } from "styled-components";
import Fuse from "fuse.js";

import { useTronSuperRepresentatives } from "@ledgerhq/live-common/lib/families/tron/react";
import { getDefaultExplorerView, getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";

import type { TFunction } from "react-i18next";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { Account, TransactionStatus } from "@ledgerhq/live-common/lib/types";

import type { Vote, SuperRepresentative } from "@ledgerhq/live-common/lib/families/tron/types";

import { openURL } from "~/renderer/linking";
import Box from "~/renderer/components/Box";
import Trophy from "~/renderer/icons/Trophy";
import Medal from "~/renderer/icons/Medal";
import Text from "~/renderer/components/Text";
import ExternalLink from "~/renderer/icons/ExternalLink";
import Cross from "~/renderer/icons/Cross";
import Check from "~/renderer/icons/Check";
import ExclamationCircle from "~/renderer/icons/ExclamationCircle";
import SearchBox from "~/renderer/screens/accounts/AccountList/SearchBox";
import debounce from "lodash/debounce";

const ScrollContainer: ThemedComponent<{}> = styled(Box).attrs(p => ({
  vertical: true,
  pl: p.theme.overflow.trackSize,
}))`
  ${p => p.theme.overflow.yAuto};
  flex: 1 1 280px;
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
  border-color: ${p => p.theme.colors.palette.divider};
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
  background-color: rgba(0,0,0,0);
`;

const Separator = styled.div`
  margin: 0 10px;
  height: 13px;
  width: 1px;
  background-color: ${p => p.theme.colors.palette.text.shade60};
`;

const SearchContainer = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: "center",
  justifyContent: "space-between",
  py: 1,
  px: 3,
  borderRadius: 4,
}))`
  margin: 0 ${p => p.theme.overflow.trackSize}px;
  border: 1px solid ${p => p.theme.colors.palette.divider};
`;

const Placeholder = styled(Box).attrs(() => ({
  vertical: true,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 4,

  color: "palette.text.shade50",
  mt: 3,
  p: 3,
  flex: "1",
}))`
  border: 1px solid ${p => p.theme.colors.palette.divider};
  margin-right: ${p => p.theme.overflow.trackSize}px;
`;

type SRRowProps = {
  sr: SuperRepresentative,
  rank: number,
  isSR?: boolean,
  value?: number,
  disabled?: boolean,
  dispatch: ({ type: string, address: string, value: string }) => void,
  onExternalLink: (address: string) => void,
};

const _SRRow = ({ sr, rank, isSR, value, disabled, dispatch, onExternalLink }: SRRowProps) => {
  const inputRef = useRef();
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
        <IconContainer
          onClick={() => dispatch({ type: "updateVote", address: sr.address, value: "" })}
        >
          <Cross size={16} />
        </IconContainer>
        <VoteInput
          // $FlowFixMe
          ref={inputRef}
          placeholder={"0"}
          min={0}
          max={null}
          type="text"
          value={value}
          disabled={!value && disabled}
          onChange={e =>
            dispatch({ type: "updateVote", address: sr.address, value: e.target.value })
          }
        />
      </InputBox>
    </Row>
  );
};

const SRRow = memo(_SRRow);

const SR_THRESHOLD = 27;
const SR_MAX_VOTES = 5;

const fuseOptions = {
  threshold: 0.1,
  keys: ["name", "address"],
  shouldSort: true,
};

const useSortedSr = (
  search: string,
  superRepresentatives: SuperRepresentative[],
  votes: Vote[],
) => {
  const [initialVotes] = useState(votes.map(({ address }) => address));

  const SR = useMemo(
    () =>
      superRepresentatives.map((sr, rank) => ({
        sr,
        name: sr.name,
        address: sr.address,
        rank: rank + 1,
        isSR: rank <= SR_THRESHOLD,
      })),
    [superRepresentatives],
  );

  const sortedVotes = useMemo(() => {
    return SR.filter(({ address }) => initialVotes.includes(address)).concat(
      SR.filter(({ address }) => !initialVotes.includes(address)),
    );
  }, [SR, initialVotes]);

  const fuse = useMemo(() => new Fuse(SR, fuseOptions), [SR]);

  const sr = useMemo(() => (search ? fuse.search(search) : sortedVotes), [
    search,
    fuse,
    sortedVotes,
  ]);

  return sr;
};

function votesReducer(state, action: { type: string, address: string, value: string }) {
  const { type, address, value } = action;
  switch (type) {
    case "updateVote": {
      const voteCount = value ? parseInt(Number(value.replace(/[^0-9]/g, ""))) : 0;
      const currentVotes = Object.values({ ...state, [address]: voteCount }).filter(Boolean);

      return {
        ...state,
        [address]: voteCount <= 0 || currentVotes.length > SR_MAX_VOTES ? 0 : voteCount,
      };
    }
    default:
      return state;
  }
}

type Props = {
  t: TFunction,
  votes: Vote[],
  account: Account,
  status: TransactionStatus,
  onChangeVotes: (votes: Vote[]) => void,
  bridgePending: boolean,
};

const AmountField = ({ t, account, onChangeVotes, status, bridgePending, votes }: Props) => {
  invariant(account && account.tronResources && votes, "account and transaction required");

  const [state, dispatch] = useReducer(
    votesReducer,
    votes.reduce((sum, { voteCount, address }) => ({ ...sum, [address]: voteCount }), {}),
  );

  useEffect(
    debounce(
      () =>
        onChangeVotes(
          Object.keys(state)
            .map(address => ({ address, voteCount: state[address] }))
            .filter(({ voteCount }) => voteCount > 0),
        ),
      400,
    ),
    [state],
  );

  const [search, setSearch] = useState("");

  const scrollRef = useRef();
  const [scrollOffset, setScrollOffset] = useState(SR_THRESHOLD);

  const explorerView = getDefaultExplorerView(account.currency);

  const { tronResources } = account;

  const votesAvailable = useMemo(() => (tronResources ? tronResources.tronPower : 0), [
    tronResources,
  ]);

  const votesUsed = useMemo(
    () => Object.values(state).reduce((sum, voteCount) => sum + Number(voteCount), 0),
    [state],
  );

  const selected = useMemo(() => Object.values(state).filter(Boolean).length, [state]);

  const max = Math.max(0, votesAvailable - votesUsed);

  const superRepresentatives = useTronSuperRepresentatives();
  const SR = useSortedSr(search, superRepresentatives, votes);

  const onExternalLink = useCallback(
    (address: string) => {
      const srURL = explorerView && getAddressExplorer(explorerView, address);

      if (srURL) openURL(srURL);
    },
    [explorerView],
  );

  const handleScroll = useCallback(() => {
    const target = scrollRef && scrollRef.current;
    // $FlowFixMe
    if (target && target.scrollTop + target.offsetHeight >= target.scrollHeight - 200)
      setScrollOffset(scrollOffset + SR_THRESHOLD);
  }, [setScrollOffset, scrollOffset]);

  const onSearch = useCallback(evt => setSearch(evt.target.value), [setSearch]);

  if (!status) return null;

  const error = Object.values(status.errors)[0];

  return (
    <>
      <SearchContainer>
        <SearchBox
          search={search}
          onTextChange={onSearch}
          placeholder={t("vote.steps.castVotes.search")}
        />
      </SearchContainer>
      <Box horizontal alignItems="center" justifyContent="space-between" py={2} px={3}>
        <Text fontSize={3} ff="Inter|Medium">
          <Trans i18nKey="vote.steps.castVotes.validators" values={{ total: SR.length }} />
        </Text>
        <Box horizontal alignItems="center">
          {selected === SR_MAX_VOTES ? (
            <Text fontSize={3} ff="Inter|Medium">
              <Trans i18nKey="vote.steps.castVotes.maxSelected" values={{ total: SR_MAX_VOTES }} />
            </Text>
          ) : (
            <Text fontSize={3} ff="Inter|Medium">
              <Trans i18nKey="vote.steps.castVotes.selected" values={{ total: selected }} />
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
      <ScrollContainer ref={scrollRef} onScroll={debounce(handleScroll, 50)}>
        {SR.slice(0, scrollOffset).map(({ sr, rank, isSR }, i) => (
          <SRRow
            key={`SR_${sr.address}_${i}`}
            sr={sr}
            rank={rank}
            isSR={isSR}
            value={state[sr.address]}
            dispatch={dispatch}
            onExternalLink={onExternalLink}
            disabled={max <= 0 || selected >= SR_MAX_VOTES}
          />
        ))}
        {SR.length <= 0 && search && (
          <Placeholder>
            <Box mb={2}>
              <ExclamationCircle size={30} />
            </Box>
            <Text ff="Inter|Medium" fontSize={5}>
              <Trans i18nKey="vote.steps.castVotes.noResults" values={{ search }}>
                <b></b>
              </Trans>
            </Text>
          </Placeholder>
        )}
      </ScrollContainer>
    </>
  );
};

export default AmountField;
