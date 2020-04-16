// @flow
import invariant from "invariant";
import React, { useCallback, useState, useRef, useEffect, memo } from "react";
import debounce from "lodash/debounce";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import styled, { css } from "styled-components";
import type { TFunction } from "react-i18next";
import {
  useTronSuperRepresentatives,
  useSortedSr,
} from "@ledgerhq/live-common/lib/families/tron/react";
import { getDefaultExplorerView, getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";
import type { Account, TransactionStatus } from "@ledgerhq/live-common/lib/types";
import type { Vote, SuperRepresentative } from "@ledgerhq/live-common/lib/families/tron/types";
import { languageSelector } from "~/renderer/reducers/settings";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { openURL } from "~/renderer/linking";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import Trophy from "~/renderer/icons/Trophy";
import Medal from "~/renderer/icons/Medal";
import Text from "~/renderer/components/Text";
import ExternalLink from "~/renderer/icons/ExternalLink";
import Check from "~/renderer/icons/Check";
import ExclamationCircle from "~/renderer/icons/ExclamationCircle";
import SearchBox from "~/renderer/screens/accounts/AccountList/SearchBox";

/** @TODO move this to common */
const SR_THRESHOLD = 27;
const SR_MAX_VOTES = 5;

const ScrollContainer: ThemedComponent<{}> = styled(Box).attrs(p => ({
  vertical: true,
  pl: p.theme.overflow.trackSize,
  pb: 56,
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
  width: min-content;
  max-width: 100%;
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

const RightFloating = styled.div`
  position: absolute;
  right: 0;
  padding: 8px;
  pointer-events none;
  opacity: 0;
`;

const InputBox = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: "center",
}))`
  position: relative;
  flex-basis: 150px;
  height: 32px;
  &:focus > ${RightFloating}, &:focus-within > ${RightFloating} {
    opacity: 1;
    pointer-events: auto;
  }
`;

const VoteInput = styled.input.attrs(() => ({
  type: "text",
  step: 1,
  min: 0,
  pattern: "[0-9]",
  placeholder: 0,
}))`
  cursor: pointer;
  flex: 1;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  height: 100%;
  padding: 0 8px;
  background-color: rgba(0, 0, 0, 0);
  border: 1px solid transparent;
  border-radius: 4px;
  border-color: ${p => (p.notEnoughVotes ? p.theme.colors.pearl : p.theme.colors.palette.divider)};
  &:disabled {
    cursor: disabled;
    color: ${p => p.theme.colors.palette.text.shade40};
    background-color: ${p => p.theme.colors.palette.background.default};
  }
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
  py: 2,
  px: 3,
  borderRadius: 4,
}))`
  margin: 0 ${p => p.theme.overflow.trackSize}px;
  border: 1px solid ${p => p.theme.colors.palette.divider};

  > input::placeholder,
  > input {
    font-size: 13px;
  }
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
  language: string,
  isSR?: boolean,
  value?: number,
  disabled?: boolean,
  maxAvailable: number,
  notEnoughVotes: boolean,
  onUpdateVote: (string, string) => void,
  onExternalLink: (address: string) => void,
};

const _SRRow = ({
  sr,
  rank,
  language,
  isSR,
  value,
  disabled,
  onUpdateVote,
  onExternalLink,
  maxAvailable,
  notEnoughVotes,
}: SRRowProps) => {
  const inputRef = useRef();
  const onTitleClick = useCallback(() => {
    onExternalLink(sr.address);
  }, [sr, onExternalLink]);
  const onFocus = useCallback(() => {
    inputRef.current && inputRef.current.select();
  }, []);

  const onChange = useCallback(
    e => {
      onUpdateVote(sr.address, e.target.value);
    },
    [sr, onUpdateVote],
  );
  const onMax = useCallback(() => {
    onUpdateVote(sr.address, String(maxAvailable + (value || 0)));
  }, [sr, onUpdateVote, maxAvailable, value]);

  /** focus input on row click */
  const onClick = useCallback(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const itemExists = typeof value === "number";

  return (
    <Row disabled={!value && disabled} active={!!value} onClick={onClick}>
      <IconContainer isSR={isSR}>{isSR ? <Trophy size={16} /> : <Medal size={16} />}</IconContainer>
      <InfoContainer>
        <Title onClick={onTitleClick}>
          <Text>{`${rank}. ${sr.name || sr.address}`}</Text>
          <IconContainer>
            <ExternalLink size={16} />
          </IconContainer>
        </Title>
        <SubTitle>
          <Trans
            i18nKey="vote.steps.castVotes.totalVotes"
            values={{ total: sr.voteCount.toLocaleString(language) }}
          >
            <b></b>
          </Trans>
          {/** @TODO add estimated yield here */}
        </SubTitle>
      </InfoContainer>
      <InputBox active={!!value}>
        <VoteInput
          // $FlowFixMe
          ref={inputRef}
          placeholder="0"
          type="text"
          maxLength="12"
          notEnoughVotes={itemExists && notEnoughVotes}
          value={itemExists ? String(value) : "0"}
          disabled={disabled}
          onFocus={onFocus}
          onChange={onChange}
        />
        {!maxAvailable || disabled ? null : (
          <RightFloating>
            <Button
              onClick={onMax}
              style={{ fontSize: "10px", padding: "0 8px", height: 22 }}
              primary
              small
              data-preventVotesInputBlur
            >
              <Trans i18nKey="vote.steps.castVotes.max" />
            </Button>
          </RightFloating>
        )}
      </InputBox>
    </Row>
  );
};

const SRRow = memo(_SRRow);
type Props = {
  t: TFunction,
  votes: Vote[],
  account: Account,
  status: TransactionStatus,
  onChangeVotes: (updater: (Vote[]) => Vote[]) => void,
  bridgePending: boolean,
};

const AmountField = ({ t, account, onChangeVotes, status, bridgePending, votes }: Props) => {
  invariant(account, "tron account required");

  const [search, setSearch] = useState("");
  const { tronResources } = account;
  invariant(tronResources && votes, "tron transaction required");

  const language = useSelector(languageSelector);

  const superRepresentatives = useTronSuperRepresentatives();
  const SR = useSortedSr(search, superRepresentatives, votes);

  const votesAvailable = tronResources.tronPower;
  const votesUsed = votes.reduce((sum, v) => sum + v.voteCount, 0);
  const votesSelected = votes.length;
  const max = Math.max(0, votesAvailable - votesUsed);

  const onUpdateVote = useCallback(
    (address, value) => {
      const raw = value ? parseInt(value.replace(/[^0-9]/g, ""), 10) : 0;
      const voteCount = raw <= 0 || votesSelected > SR_MAX_VOTES ? 0 : raw;
      onChangeVotes(existing => {
        const update = existing.filter(v => v.address !== address);
        if (voteCount > 0) {
          update.push({ address, voteCount });
        }
        return update;
      });
    },
    [onChangeVotes, votesSelected],
  );

  const scrollRef = useRef();
  const [scrollOffset, setScrollOffset] = useState(SR_THRESHOLD);

  const explorerView = getDefaultExplorerView(account.currency);

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
      setScrollOffset(Math.min(superRepresentatives.length, scrollOffset + SR_THRESHOLD));
  }, [setScrollOffset, scrollOffset, superRepresentatives.length]);

  const onSearch = useCallback(evt => setSearch(evt.target.value), [setSearch]);

  const notEnoughVotes = votesUsed > votesAvailable;
  const maxAvailable = Math.max(0, votesAvailable - votesUsed);

  /** auto focus first input on mount */
  useEffect(() => {
    /** $FlowFixMe */
    if (scrollRef && scrollRef.current && scrollRef.current.querySelector) {
      const firstInput = scrollRef.current.querySelector("input");
      if (firstInput && firstInput.focus) firstInput.focus();
    }
  }, []);

  if (!status) return null;
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
          {votesSelected === SR_MAX_VOTES ? (
            <Text fontSize={3} ff="Inter|Medium">
              <Trans i18nKey="vote.steps.castVotes.maxSelected" values={{ total: SR_MAX_VOTES }} />
            </Text>
          ) : (
            <Text fontSize={3} ff="Inter|Medium">
              <Trans i18nKey="vote.steps.castVotes.selected" values={{ total: votesSelected }} />
            </Text>
          )}
          <Separator />
          {max > 0 ? (
            <Text fontSize={3} ff="Inter|Medium">
              <Trans i18nKey="vote.steps.castVotes.votes" values={{ total: max }} />
            </Text>
          ) : notEnoughVotes ? (
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
        {SR.slice(0, scrollOffset).map(({ sr, rank, isSR }, i) => {
          const item = votes.find(v => v.address === sr.address);
          return (
            <SRRow
              key={`SR_${sr.address}_${i}`}
              sr={sr}
              rank={rank}
              isSR={isSR}
              language={language}
              value={item && item.voteCount}
              onUpdateVote={onUpdateVote}
              onExternalLink={onExternalLink}
              disabled={!item && votesSelected >= SR_MAX_VOTES}
              notEnoughVotes={notEnoughVotes}
              maxAvailable={maxAvailable}
            />
          );
        })}
        {SR.length <= 0 && search && (
          <Placeholder>
            <Box mb={2}>
              <ExclamationCircle size={30} />
            </Box>
            <Text ff="Inter|Medium" fontSize={4}>
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
