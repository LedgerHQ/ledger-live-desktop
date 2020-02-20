// @flow

import React, { PureComponent } from "react";
import { Trans, withTranslation } from "react-i18next";
import { seedConfirmation, seedNext } from "@ledgerhq/live-common/lib/deviceWordings";
import OptionRow, { IconOptionRow } from "~/renderer/components/OptionRow";
import Text from "~/renderer/components/Text";
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

class WriteSeedBlue extends PureComponent<Props, *> {
  render() {
    const { t } = this.props;

    const steps = [
      {
        key: "step1",
        icon: <IconOptionRow>{"1."}</IconOptionRow>,
        desc: t("onboarding.writeSeed.initialize.blue.step1"),
      },
      {
        key: "step2",
        icon: <IconOptionRow>{"2."}</IconOptionRow>,
        desc: (
          <Box style={{ display: "block" }}>
            <Trans i18nKey="onboarding.writeSeed.initialize.blue.step2">
              {"Tap"}
              <Text ff="Inter|SemiBold" color="palette.text.shade100">
                {{ seedNext }}
              </Text>
              {"to move to the next words. Repeat the process until the"}
              <Text ff="Inter|SemiBold" color="palette.text.shade100">
                {{ seedConfirmation }}
              </Text>
              {"screen appears."}
            </Trans>
          </Box>
        ),
      },
      {
        key: "step3",
        icon: <IconOptionRow>{"3."}</IconOptionRow>,
        desc: t("onboarding.writeSeed.initialize.blue.step3"),
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
        <Box alignItems="center">
          <Inner style={{ width: 760 }}>
            <Box style={{ width: 260, justifyContent: "center", alignItems: "center" }}>
              <InvertableImg alt="" src={WriteSeedOnb} />
            </Box>
            <Box shrink flow={2} m={0}>
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

export default withTranslation()(WriteSeedBlue);
