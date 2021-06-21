// @flow
import React from "react";

import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import Box from "../../components/Box";
import Button from "../../components/Button";

const Container: ThemedComponent<{}> = styled(Box).attrs(p => ({
  horizontal: true,
  flex: 1,
  fontSize: 4,
}))`
  flex-wrap: wrap;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`;

const TitleContent = styled(Box).attrs(p => ({
  ff: "Inter|SemiBold",
  fontSize: 5,
  horizontal: true,
  alignItems: "center",
  mb: 1,
}))`
  word-break: break-word;
  * + * {
    margin-left: 12px;
  }
`;

const Content = styled(Box).attrs(() => ({
  ff: "Inter|Medium",
  flex: 1,
}))`
  min-width: 192px;
  flex-grow: 1;
  word-break: break-word;
  margin: 16px;
`;

const FooterContent: ThemedComponent<{}> = styled(Box)`
  min-width: 192px;
  max-width: calc(100% - 32px);
  flex-grow: 0;
  margin: 16px;
`;

const CTA = styled(Button).attrs(p => ({
  primary: !p.outline,
  outlineGrey: p.outline,
}))`
  justify-content: center;
  min-height: 40px;
  height: auto;

  > * {
    > span {
      display: flex;
      flex-shrink: 1;
    }
    > * + * {
      margin-left: 8px;
    }
  }
`;

type Props = {
  children: React$Node,
  title: React$Node,
  horizontal?: boolean,
  ctaLabel?: React$Node,
  ctaOutline?: boolean,
  onClick: Function,
  Icon: React$ComponentType<{ size: number }>,
} & Box.propTypes;

export default function CatalogCTA({
  children: description,
  title,
  Icon,
  ctaLabel,
  ctaOutline,
  onClick,
  ...rest
}: Props) {
  return (
    <Container {...rest}>
      <Content>
        <TitleContent>
          <Icon size={18} />
          <span>{title}</span>
        </TitleContent>
        <div>{description}</div>
      </Content>
      {!!ctaLabel && (
        <FooterContent>
          <CTA outline={ctaOutline} onClick={onClick}>
            {ctaLabel}
          </CTA>
        </FooterContent>
      )}
    </Container>
  );
}
