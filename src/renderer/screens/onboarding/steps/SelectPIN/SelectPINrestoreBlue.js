// @flow

import React from "react";
import { Trans, withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import IconChevronRight from "~/renderer/icons/ChevronRight";
import { getDeviceModel } from "@ledgerhq/devices";
import InvertableImg from "~/renderer/components/InvertableImg";
import { DisclaimerBox } from "~/renderer/screens/onboarding/steps/SelectPIN";
import OptionRow, { IconOptionRow } from "~/renderer/components/OptionRow";
import { Inner } from "~/renderer/screens/onboarding/sharedComponents";
import RestoreBlue from "~/renderer/images/select-pin-blue-onb.svg";
import { restoreConfiguration } from "@ledgerhq/live-common/lib/deviceWordings";

type Props = {
  t: TFunction,
};

const SelectPINrestoreBlue = ({ t }: Props) => {
  const stepsLedgerBlue = [
    {
      key: "step1",
      icon: <IconOptionRow>{"1."}</IconOptionRow>,
      desc: t("onboarding.selectPIN.restore.instructions.blue.step1", getDeviceModel("blue")),
    },
    {
      key: "step2",
      icon: <IconOptionRow>{"2."}</IconOptionRow>,
      desc: (
        <Box style={{ display: "block" }}>
          <Trans i18nKey="onboarding.selectPIN.restore.instructions.blue.step2">
            {"Tap on"}
            <Text ff="Inter|SemiBold" color="palette.text.shade100">
              {{ restoreConfiguration }}
            </Text>
          </Trans>
        </Box>
      ),
    },
    {
      key: "step3",
      icon: <IconOptionRow>{"3."}</IconOptionRow>,
      desc: t("onboarding.selectPIN.restore.instructions.blue.step3"),
    },
  ];

  const disclaimerNotes = [
    {
      key: "note1",
      icon: <IconChevronRight size={12} />,
      desc: t("onboarding.selectPIN.disclaimer.note1"),
    },
    {
      key: "note2",
      icon: <IconChevronRight size={12} />,
      desc: t("onboarding.selectPIN.disclaimer.note2"),
    },
    {
      key: "note3",
      icon: <IconChevronRight size={12} />,
      desc: t("onboarding.selectPIN.disclaimer.note3"),
    },
  ];

  return (
    <Box alignItems="center">
      <Inner style={{ width: 550 }}>
        <Box style={{ width: 180, justifyContent: "center", alignItems: "center" }}>
          <InvertableImg alt="" src={RestoreBlue} />
        </Box>
        <Box>
          <Box shrink grow flow={4}>
            {stepsLedgerBlue.map(step => (
              <OptionRow key={step.key} step={step} />
            ))}
          </Box>
        </Box>
      </Inner>
      <DisclaimerBox mt={6} disclaimerNotes={disclaimerNotes} color="palette.text.shade80" />
    </Box>
  );
};

export default withTranslation()(SelectPINrestoreBlue);
