// @flow
import React from "react";
import Box from "~/renderer/components/Box";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import Alert from "~/renderer/components/Alert";
import { Trans } from "react-i18next";
import IconCheckFull from "~/renderer/icons/CheckFull";
import { colors } from "~/renderer/styles/theme";
import fullnodeIllustration from "~/renderer/images/fullnode.png";
import Button from "~/renderer/components/Button";
import { urls } from "~/config/urls";

const Illustration = styled.div`
  margin-bottom: 24px;
  width: 193px;
  height: 130px;
  background: url(${fullnodeIllustration});
  background-size: contain;
  align-self: center;
`;

const Item = styled.div`
  display: flex;
  flex-direction: horizontal;
  align-items: center;
  padding: 4px 0;
  ${Text} {
    flex: 1;
  }
`;

const List = styled.div`
  margin-bottom: 27px;
`;

const Landing = () => (
  <Box>
    <Illustration />
    <Text ff="Inter|SemiBold" textAlign={"center"} fontSize={6} color="palette.text.shade100">
      <Trans i18nKey="fullNode.modal.steps.landing.header" />
    </Text>
    <Text ff="Inter|Medium" textAlign={"center"} fontSize={4} color="palette.text.shade50" my={24}>
      <Trans i18nKey="fullNode.modal.steps.landing.description" />
    </Text>
    <List>
      <Item>
        <IconCheckFull size={16} color={colors.positiveGreen} />
        <Text ml={2} ff="Inter|Medium" fontSize={4} color="palette.text.shade100">
          <Trans i18nKey="fullNode.modal.steps.landing.list.item1" />
        </Text>
      </Item>
      <Item>
        <IconCheckFull size={16} color={colors.positiveGreen} />
        <Text ml={2} ff="Inter|Medium" fontSize={4} color="palette.text.shade100">
          <Trans i18nKey="fullNode.modal.steps.landing.list.item2" />
        </Text>
      </Item>
      <Item>
        <IconCheckFull size={16} color={colors.positiveGreen} />
        <Text ml={2} ff="Inter|Medium" fontSize={4} color="palette.text.shade100">
          <Trans i18nKey="fullNode.modal.steps.landing.list.item3" />
        </Text>
      </Item>
    </List>
    <Alert type="secondary" learnMoreUrl={urls.satstacks.learnMore}>
      <Trans i18nKey="fullNode.modal.steps.landing.disclaimer" />
    </Alert>
  </Box>
);

export const StepLandingFooter = ({
  onClose,
  onContinue,
}: {
  onClose: () => void,
  onContinue: () => void,
}) => (
  <Box horizontal alignItems={"flex-end"}>
    <Button secondary onClick={onClose} mr={3}>
      <Trans i18nKey="common.cancel" />
    </Button>
    <Button primary onClick={onContinue}>
      <Trans i18nKey="common.continue" />
    </Button>
  </Box>
);

export default Landing;
