// @flow

import React from "react";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Text from "~/renderer/components/Text";
import IconCheck from "~/renderer/icons/Check";
import IconDot from "~/renderer/icons/Dot";

const StepperContainer: ThemedComponent<*> = styled.div`
  display: flex;
  flex-direction: column;
`;

const StepContainer = styled.div`
  display: flex;
  flex-direction: row;

  & ${Text} {
    transition: opacity ease-out 200ms;
    ${({ status }) => {
      if (status === "active" || status === "success") {
        return css`
          opacity: 1;
        `;
      } else {
        return css`
          opacity: 0.3;
        `;
      }
    }}
  }
`;

const StepIconContainer = styled.div`
  height: 24px;
  width: 24px;
  border-radius: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  transition: color ease-out 200ms, background ease-out 200ms;

  ${({ status, theme }) => {
    if (status === "success") {
      return css`
        background: #66be5410;
        color: #66be54;
      `;
    }
    if (status === "active") {
      return css`
        background: none;
        color: ${theme.colors.palette.primary.main};
      `;
    }

    if (status === "inactive") {
      return css`
        background: none;
        color: ${theme.colors.palette.text.shade30};
      `;
    }
  }};
`;

const StepSeparator = styled.div`
  height: 32px;
  width: 0px;
  margin-left: 12px;
  border-left: 1px rgba(20, 37, 51, 0.2) dashed;

  ${({ status, theme }) => {
    if (status === "success") {
      return css`
        border-left: 1px #66be5410 solid;
      `;
    }
    if (status === "active") {
      return css`
        border-left: 1px ${theme.colors.palette.text.shade20} dashed;
      `;
    }

    if (status === "inactive") {
      return css`
        border-left: 1px ${theme.colors.palette.text.shade20} dashed;
      `;
    }
  }};
`;

type StepMeta = { label: string, id: string, status: string, active: boolean };

type StepProps = StepMeta & {
  hasSeparator: boolean,
};

type StepperProps = {
  steps: StepMeta[],
};

function Step({ label, status, hasSeparator }: StepProps) {
  return (
    <>
      <StepContainer status={status}>
        <StepIconContainer status={status}>
          {status === "success" ? (
            <IconCheck size={7} />
          ) : status === "active" ? (
            <IconDot size={7} />
          ) : status === "inactive" ? (
            <IconDot size={7} />
          ) : null}
        </StepIconContainer>
        <Text
          ml="16px"
          color="palette.text.shade100"
          ff="Inter|Bold"
          fontSize="10px"
          lineHeight="24px"
          letterSpacing="0.1em"
          uppercase
        >
          {label}
        </Text>
      </StepContainer>
      {hasSeparator ? <StepSeparator status={status} /> : null}
    </>
  );
}

export function Stepper({ steps }: StepperProps) {
  const { t } = useTranslation();

  return (
    <StepperContainer>
      {steps.map((step, index) => (
        <Step
          key={step.id}
          id={step.id}
          label={t(`onboarding.screens.tutorial.steps.${step.id}`)}
          status={step.status}
          active={step.active}
          hasSeparator={index + 1 !== steps.length}
        />
      ))}
    </StepperContainer>
  );
}
