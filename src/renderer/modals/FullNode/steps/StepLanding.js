// @flow
import React, { useCallback } from "react";
import Box from "~/renderer/components/Box";
import styled from "styled-components";
import { openURL } from "~/renderer/linking";
import Text from "~/renderer/components/Text";
import InfoBox from "~/renderer/components/InfoBox";
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
`;

const List = styled.div`
  margin-bottom: 27px;
`;

const Landing = () => {
  const onLearnMore = useCallback(() => {
    openURL(urls.satstacks.learnMore);
  }, []);

  return (
    <Box>
      <Illustration />
      <Text ff="Inter|SemiBold" textAlign={"center"} fontSize={6} color="palette.text.shade100">
        <Trans i18nKey="fullNode.modal.steps.landing.header" />
      </Text>
      <Text
        ff="Inter|Medium"
        textAlign={"center"}
        fontSize={4}
        color="palette.text.shade50"
        my={24}
      >
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
      <InfoBox type="secondary" onLearnMore={onLearnMore}>
        <Text ff="Inter|Regular" fontSize={3} color="palette.text.shade50">
          <Trans i18nKey="fullNode.modal.steps.landing.disclaimer" />
        </Text>
      </InfoBox>
    </Box>
  );
};

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
