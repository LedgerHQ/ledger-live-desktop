// @flow
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Wrapper, Illustration, Number, Title, Content, BulletRowIcon } from "./shared";
import Box from "~/renderer/components/Box";
import BulletRow from "~/renderer/components/BulletRow";
import Text from "~/renderer/components/Text";
import IconCopy from "~/renderer/icons/Copy";
import illustration from "~/renderer/images/USBTroubleshooting/illus1.png";

let clipboard = null;

if (!process.env.STORYBOOK_ENV) {
  const electron = require("electron");
  clipboard = electron.clipboard; // eslint-disable-line
}

const Pre = styled(Box).attrs({ selectable: true })`
  padding: 10px 12px;
  border-radius: 4px;
  margin: 8px 0;
  background-color: ${p => p.theme.colors.palette.text.shade5};
  color: ${p => p.theme.colors.palette.text.shade80};
  font-family: monospace;
  font-size: 12px;
  align-items: center;

  & ${Box}:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`;
const snippet =
  "wget -q -O - https://raw.githubusercontent.com/LedgerHQ/udev-rules/master/add_udev_rules.sh | sudo bash";

const UpdateUdevRulesSolution = ({ number = 1 }: { number?: number }) => {
  const { t } = useTranslation();

  const onCopy = useCallback(() => {
    clipboard && clipboard.writeText(snippet);
  }, []);

  return (
    <Wrapper>
      <Number>{t("connectTroubleshooting.solution", { number })}</Number>
      <Title>{t("connectTroubleshooting.steps.1.linux.title")}</Title>
      <Content>
        <Illustration image={illustration} />
        <Box flex={2}>
          <Text mb={3} ff="Inter|SemiBold" color="palette.text.shade90" fontSize={5}>
            {t("connectTroubleshooting.followSteps")}
          </Text>
          <BulletRow
            step={{
              icon: <BulletRowIcon>{1}</BulletRowIcon>,
              desc: (
                <Text ff="Inter|Medium" fontSize={4}>
                  {t("connectTroubleshooting.steps.1.linux.bullets.0")}
                </Text>
              ),
            }}
          />
          <Pre horizontal>
            {snippet}
            <Box onClick={onCopy}>
              <IconCopy size={16} />
            </Box>
          </Pre>
          <BulletRow
            step={{
              icon: <BulletRowIcon>{2}</BulletRowIcon>,
              desc: (
                <Text ff="Inter|Medium" fontSize={4}>
                  {t("connectTroubleshooting.steps.1.linux.bullets.1")}
                </Text>
              ),
            }}
          />
        </Box>
      </Content>
    </Wrapper>
  );
};

export default UpdateUdevRulesSolution;
