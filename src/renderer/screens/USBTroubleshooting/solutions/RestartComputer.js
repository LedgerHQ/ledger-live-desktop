// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import { Wrapper, Illustration, Number, Title, Content, BulletRowIcon } from "./shared";
import Box from "~/renderer/components/Box";
import BulletRow from "~/renderer/components/BulletRow";
import Text from "~/renderer/components/Text";

import illustration from "~/renderer/images/USBTroubleshooting/illus3.png";

const RestartComputerSolution = ({ number = 1 }: { number?: number }) => {
  const { t } = useTranslation();
  const bullets = Array.from(
    t("USBTroubleshooting.solutions.restartComputer.bullets", { returnObjects: true }),
  );

  return (
    <Wrapper>
      <Number>{t("USBTroubleshooting.solution", { number })}</Number>
      <Title>{t("USBTroubleshooting.solutions.restartComputer.title")}</Title>
      <Content>
        <Illustration image={illustration} />
        <Box flex={2}>
          <Text mb={3} ff="Inter|SemiBold" color="palette.text.shade90" fontSize={5}>
            {t("USBTroubleshooting.followSteps")}
          </Text>
          {bullets.map((bullet, i) => (
            <BulletRow
              key={i}
              step={{
                icon: <BulletRowIcon>{i + 1}</BulletRowIcon>,
                desc: (
                  <Text ff="Inter|Medium" fontSize={4}>
                    {bullet}
                  </Text>
                ),
              }}
            />
          ))}
        </Box>
      </Content>
    </Wrapper>
  );
};

export default RestartComputerSolution;
