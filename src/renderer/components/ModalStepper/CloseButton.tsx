import React from "react";
import { Box, Button, Icons } from "@ledgerhq/react-ui";
import styled from "styled-components";

const CloseContainer = styled(Box).attrs(() => ({
  top: 7,
  right: 7,
  position: "absolute",
}))``;

export default function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <CloseContainer>
      <Button.Unstyled onClick={onClick}>
        <Icons.CloseMedium size={20} />
      </Button.Unstyled>
    </CloseContainer>
  );
}
