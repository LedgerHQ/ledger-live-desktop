// @flow
import React, { useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Wrapper, Illustration, Number, Title, Content, BulletRowIcon } from "./shared";
import Box from "~/renderer/components/Box";
import BulletRow from "~/renderer/components/BulletRow";
import Text from "~/renderer/components/Text";
import FakeLink from "~/renderer/components/FakeLink";
import { openURL } from "~/renderer/linking";

import illustration from "~/renderer/images/USBTroubleshooting/illus4.png";

const TryAnotherComputerSolution = ({ number = 1 }: { number?: number }) => {
  const { t } = useTranslation();
  const link = "https://ledger.com/ledger-live";
  const onClickLink = useCallback(() => {
    openURL(link);
  }, []);

  return (
    <Wrapper>
      <Number>{t("connectTroubleshooting.solution", { number })}</Number>
      <Title>{t("connectTroubleshooting.steps.2.anotherComputer.title")}</Title>
      <Content>
        <Illustration image={illustration} height={148} />
        <Box flex={2}>
          <Text mb={3} ff="Inter|SemiBold" color="palette.text.shade90" fontSize={5}>
            {t("connectTroubleshooting.followSteps")}
          </Text>
          <BulletRow
            step={{
              icon: <BulletRowIcon>1</BulletRowIcon>,
              desc: (
                <Text ff="Inter|Medium" fontSize={4}>
                  <Trans
                    i18nKey="connectTroubleshooting.steps.2.anotherComputer.bullets.0"
                    values={{ link }}
                  >
                    <FakeLink onClick={onClickLink} />
                  </Trans>
                </Text>
              ),
            }}
          />
          <BulletRow
            step={{
              icon: <BulletRowIcon>1</BulletRowIcon>,
              desc: (
                <Text ff="Inter|Medium" fontSize={4}>
                  {t("connectTroubleshooting.steps.2.anotherComputer.bullets.1")}
                </Text>
              ),
            }}
          />
        </Box>
      </Content>
    </Wrapper>
  );
};

export default TryAnotherComputerSolution;
