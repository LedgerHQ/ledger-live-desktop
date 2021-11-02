import React from "react";
import styled from "styled-components";
import { Button, Text, Icons } from "@ledgerhq/react-ui";

const IllustrationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
`;

const TitleText = styled(Text).attrs(() => ({
  type: "h3",
  ff: "Alpha|Medium",
  fontSize: "20px",
  mb: "12px",
  uppercase: true,
}))`
  color: ${p => p.theme.colors.palette.neutral.c100};
`;

const DescriptionText = styled(Text).attrs(() => ({
  ff: "Inter|Regular",
  fontSize: "12px",
}))`
  color: ${p => p.theme.colors.palette.neutral.c100};
`;

// TODO: use proper button styling once all styles are covered in the design sys
const ArrowButton = styled(Button).attrs(() => ({
  type: "primary",
  size: "large",
  Icon: Icons.ArrowRightRegular,
  iconButton: true,
}))`
  margin-top: 27px;
  margin-right: 12px;
  align-self: flex-end;
`;

const Container = styled.div`
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  border: 1px solid ${p => p.theme.colors.palette.neutral.c40};
  position: relative;
  display: flex;
  flex-direction: column;
  text-align: left;
`;

// TODO: add button hover behavior for the ArrowButton
const UseCaseOptionContainer = styled.button`
  border: none;
  outline: none;
  width: 301px;
  box-sizing: border-box;
  background-color: transparent;
  position: relative;
  cursor: pointer;

  &:hover ${TitleText} {
    text-decoration: underline;
  }
`;

interface UseCaseOptionProps {
  title: React.ReactNode;
  description: React.ReactNode;
  Illu: React.ReactNode;
  onClick: () => void;
  id?: string;
}

export function UseCaseOption({ title, description, Illu, onClick, id }: UseCaseOptionProps) {
  return (
    <UseCaseOptionContainer id={id} onClick={onClick}>
      <Container>
        <IllustrationContainer>{Illu}</IllustrationContainer>
        <TitleText>{title}</TitleText>
        <DescriptionText>{description}</DescriptionText>
        <ArrowButton />
      </Container>
    </UseCaseOptionContainer>
  );
}
