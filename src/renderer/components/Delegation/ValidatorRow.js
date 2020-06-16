// @flow
import React, { useRef, useCallback, memo } from "react";
import { Trans } from "react-i18next";
import styled, { css } from "styled-components";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import ExternalLink from "~/renderer/icons/ExternalLink";

export const IconContainer: ThemedComponent<*> = styled.div`
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

const SideInfo = styled(Box)``;

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
  overflow: visible;
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
  ${p =>
    p.onClick
      ? css`
          &:hover {
            border-color: ${p.theme.colors.palette.primary.main};
          }
          ${IconContainer} {
            opacity: 1;
            color: inherit;
          }
        `
      : ""}
`;

type ValidatorRowProps = {
  validator: { address: string },
  icon: React$Node,
  title: React$Node,
  subtitle: React$Node,
  sideInfo?: React$Node,
  value?: number,
  disabled?: boolean,
  maxAvailable?: number,
  notEnoughVotes?: boolean,
  onClick?: (*) => void,
  Input?: React$Node,
  onUpdateVote?: (string, string) => void,
  onExternalLink: (address: string) => void,
  style?: *,
};

const ValidatorRow = ({
  validator,
  icon,
  title,
  subtitle,
  sideInfo,
  value,
  disabled,
  Input,
  onUpdateVote,
  onExternalLink,
  maxAvailable = 0,
  notEnoughVotes,
  onClick = () => {},
  style,
}: ValidatorRowProps) => {
  const inputRef = useRef();
  const onTitleClick = useCallback(
    e => {
      e.stopPropagation();
      onExternalLink(validator.address);
    },
    [validator, onExternalLink],
  );
  const onFocus = useCallback(() => {
    inputRef.current && inputRef.current.select();
  }, []);

  const onChange = useCallback(
    e => {
      onUpdateVote && onUpdateVote(validator.address, e.target.value);
    },
    [validator, onUpdateVote],
  );
  const onMax = useCallback(() => {
    onUpdateVote && onUpdateVote(validator.address, String(maxAvailable + (value || 0)));
  }, [validator, onUpdateVote, maxAvailable, value]);

  /** focus input on row click */
  const onRowClick = useCallback(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
    onClick(validator);
  }, [inputRef, onClick, validator]);

  const itemExists = typeof value === "number";

  const input =
    Input ||
    (onUpdateVote ? (
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
            >
              <Trans i18nKey="vote.steps.castVotes.max" />
            </Button>
          </RightFloating>
        )}
      </InputBox>
    ) : null);

  return (
    <Row style={style} disabled={!value && disabled} active={!!value} onClick={onRowClick}>
      {icon}
      <InfoContainer>
        <Title onClick={onTitleClick}>
          <Text>{title}</Text>
          <IconContainer>
            <ExternalLink size={16} />
          </IconContainer>
        </Title>
        <SubTitle>{subtitle}</SubTitle>
      </InfoContainer>
      <SideInfo>{sideInfo}</SideInfo>
      {input}
    </Row>
  );
};

export default memo<ValidatorRowProps>(ValidatorRow);
