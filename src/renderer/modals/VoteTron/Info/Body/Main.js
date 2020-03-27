// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Popover from "~/renderer/components/Popover";
import Text from "~/renderer/components/Text";
import InfoCircle from "~/renderer/icons/InfoCircle";
import votesImage from "~/renderer/images/votes.png";

export default function VoteTronInfoModalBodyMain() {
  const { t } = useTranslation();

  return (
    <Box flow={4} mx={4}>
      <TrackPage category="Voting Flow" name="Step Vote" />

      <Box flow={1} alignItems="center">
        <Box mb={4}>
          <Img src={votesImage} />
        </Box>

        <Box mb={4}>
          <Text ff="Inter|SemiBold" fontSize={4} textAlign="center">
            {t("tron.manage.vote.steps.vote.description")}
          </Text>

          <Popover
            position="right"
            content={
              <Box vertical px={2}>
                <Box vertical alignItems="start" justifyContent="start" my={2}>
                  <Text ff="Inter|SemiBold" fontSize={4} color="palette.primary.main">
                    {t("tron.manage.vote.steps.vote.info.superRepresentative.title")}
                  </Text>

                  <Text fontSize={3} textAlign="left" color="palette.text.shade80">
                    {t("tron.manage.vote.steps.vote.info.superRepresentative.description")}
                  </Text>
                </Box>

                <Box vertical alignItems="start" justifyContent="start" my={2}>
                  <Text ff="Inter|SemiBold" fontSize={4} color="palette.primary.main">
                    {t("tron.manage.vote.steps.vote.info.candidates.title")}
                  </Text>

                  <Text fontSize={3} textAlign="left" color="palette.text.shade80">
                    {t("tron.manage.vote.steps.vote.info.candidates.description")}
                  </Text>
                </Box>
              </Box>
            }
          >
            <Box
              horizontal
              alignSelf="center"
              alignItems="center"
              p={2}
              justifyContent="center"
              color="palette.text.shade50"
            >
              <Text ff="Inter|SemiBold" fontSize={2}>
                {t("tron.manage.vote.steps.vote.info.message")}
              </Text>

              <Box ml={1}>
                <InfoCircle size={12} />
              </Box>
            </Box>
          </Popover>
        </Box>
      </Box>
    </Box>
  );
}

const Img = styled.img`
  width: 182px;
  height: auto;
`;
