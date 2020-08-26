import React from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";

import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import BulletRow from "~/renderer/components/BulletRow";

const BulletRowIcon = styled(Box).attrs(() => ({
  ff: "Inter|SemiBold",
  fontSize: 10,
  textAlign: "center",
  color: "wallet",
  pl: 2,
}))`
  background-color: ${p => p.theme.colors.blueTransparentBackground};
  border-radius: 12px;
  display: inline-flex;
  height: 18px;
  width: 18px;
  padding: 0px;
  padding-top: 2px;
`;

const Plus = styled(Box).attrs(() => ({
  ff: "Inter|SemiBold",
  fontSize: 13,
  textAlign: "center",
  color: "wallet",
  pl: 2,
}))`
  display: inline-flex;
  background-color: ${p => p.theme.colors.blueTransparentBackground};
  border-radius: 4px;
  height: 14px;
  line-height: 12px;
  width: 14px;
  padding: 0;
`;

const stepsImportMobile = [
  {
    key: "step1",
    icon: <BulletRowIcon>{"1"}</BulletRowIcon>,
    desc: (
      <Box style={{ display: "block" }}>
        <Trans i18nKey="settings.export.modal.step1">
          {"Tap the"}
          <Text ff="Inter|SemiBold" color="palette.text.shade100">
            <Plus>{"+"}</Plus>
          </Text>
          {"button in"}
          <Text ff="Inter|SemiBold" color="palette.text.shade100">
            {"Accounts"}
          </Text>
        </Trans>
      </Box>
    ),
  },
  {
    key: "step2",
    icon: <BulletRowIcon>{"2"}</BulletRowIcon>,
    desc: (
      <Box style={{ display: "block" }}>
        <Trans i18nKey="settings.export.modal.step2">
          {"Tap"}
          <Text ff="Inter|SemiBold" color="palette.text.shade100">
            {"Import desktop accounts"}
          </Text>
        </Trans>
      </Box>
    ),
  },
  {
    key: "step3",
    icon: <BulletRowIcon>{"3"}</BulletRowIcon>,
    desc: (
      <Box style={{ display: "block" }}>
        <Trans i18nKey="settings.export.modal.step3">
          {"Scan the"}
          <Text ff="Inter|SemiBold" color="palette.text.shade100">
            {"LiveQR Code"}
          </Text>
          {"until the loader hits 100%"}
        </Trans>
      </Box>
    ),
  },
];

const ExportInstructions = () => (
  <>
    <Box shrink style={{ fontSize: 13, margin: 15 }}>
      <Text ff="Inter|SemiBold" color="palette.text.shade100">
        <Trans i18nKey="settings.export.modal.listTitle" />
      </Text>
    </Box>
    <Box>
      {stepsImportMobile.map(step => (
        <BulletRow key={step.key} step={step} />
      ))}
    </Box>
  </>
);

export default ExportInstructions;
