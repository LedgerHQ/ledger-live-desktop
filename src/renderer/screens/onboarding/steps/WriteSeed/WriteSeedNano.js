// @flow

import React, { PureComponent } from "react";
import OptionRow, { IconOptionRow } from "~/renderer/components/OptionRow";
import { seedWord1 } from "@ledgerhq/live-common/lib/deviceWordings";
import Text from "~/renderer/components/Text";
import { Trans, withTranslation } from "react-i18next";
import IconChevronRight from "~/renderer/icons/ChevronRight";
import Box from "~/renderer/components/Box";
import type { TFunction } from "react-i18next";
import {
  Description,
  DisclaimerBox,
  Inner,
  Title,
} from "~/renderer/screens/onboarding/sharedComponents";
import InvertableImg from "~/renderer/components/InvertableImg";
import WriteSeedOnb from "~/renderer/images/write-seed-onb.svg";

type Props = {
  t: TFunction,
};

class WriteSeedNano extends PureComponent<Props, *> {
  render() {
    const { t } = this.props;

    const steps = [
      {
        key: "step1",
        icon: <IconOptionRow>{"1."}</IconOptionRow>,
        desc: (
          <Box style={{ display: "block" }}>
            <Trans i18nKey="onboarding.writeSeed.initialize.nano.step1">
              {"Copy the word displayed below"}
              <Text ff="Inter|SemiBold" color="palette.text.shade100">
                {{ seedWord1 }}
              </Text>
              {"in position 1 on a blank Recovery sheet."}
            </Trans>
          </Box>
        ),
      },
      {
        key: "step2",
        icon: <IconOptionRow>{"2."}</IconOptionRow>,
        desc: (
          <Box style={{ display: "block" }}>
            <Trans i18nKey="onboarding.writeSeed.initialize.nano.step2">
              {"Press the right button to continue and write down all 24 words."}
            </Trans>
          </Box>
        ),
      },
      {
        key: "step3",
        icon: <IconOptionRow>{"3."}</IconOptionRow>,
        desc: t("onboarding.writeSeed.initialize.nano.step3"),
      },
    ];
    const disclaimerNotes = [
      {
        key: "note1",
        icon: <IconChevronRight size={12} />,
        desc: t("onboarding.writeSeed.disclaimer.note1"),
      },
      {
        key: "note2",
        icon: <IconChevronRight size={12} />,
        desc: t("onboarding.writeSeed.disclaimer.note2"),
      },
      {
        key: "note3",
        icon: <IconChevronRight size={12} />,
        desc: t("onboarding.writeSeed.disclaimer.note3"),
      },
      {
        key: "note4",
        icon: <IconChevronRight size={12} />,
        desc: t("onboarding.writeSeed.disclaimer.note4"),
      },
    ];

    return (
      <>
        <Box mb={3}>
          <Title>{t("onboarding.writeSeed.initialize.title")}</Title>
          <Description>
            <Trans i18nKey="onboarding.writeSeed.initialize.desc" parent="div">
              {"Your 24-word recovery phrase is the"}
              <Text ff="Inter|SemiBold" color="palette.text.shade100">
                {"only backup"}
              </Text>
              {"of your private keys."}
            </Trans>
          </Description>
        </Box>
        <Box alignItems="center" mt={3}>
          <Inner style={{ width: 700 }}>
            <Box style={{ width: 300 }} justifyContent="center" alignItems="center">
              <InvertableImg alt="" src={WriteSeedOnb} />
            </Box>

            <Box shrink grow flow={4}>
              {steps.map(step => (
                <OptionRow key={step.key} step={step} />
              ))}
            </Box>
          </Inner>
          <DisclaimerBox mt={6} disclaimerNotes={disclaimerNotes} color="palette.text.shade80" />
        </Box>
      </>
    );
  }
}

export default withTranslation()(WriteSeedNano);
