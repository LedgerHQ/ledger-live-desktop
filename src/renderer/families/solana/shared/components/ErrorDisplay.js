//@flow
import React from "react";
import Box from "~/renderer/components/Box";
import styled from "styled-components";
import TranslatedError from "~/renderer/components/TranslatedError";
import { ErrorContainer } from "~/renderer/components/Input";

const ErrorBox = styled(Box)`
  color: ${p => p.theme.colors.pearl};
`;

type Props = {
  error: Error,
};

export default function ErrorDisplay({ error }: Props) {
  return (
    <ErrorContainer hasError={true}>
      <ErrorBox>
        <TranslatedError error={error} />
      </ErrorBox>
    </ErrorContainer>
  );
}
