// @flow
import React from "react";
import { clipboard } from "electron";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import type { StepProps } from "../types";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import { radii } from "~/renderer/styles/theme";
import Label from "~/renderer/components/Label";
import IconPaste from "~/renderer/icons/Paste";
import Input from "~/renderer/components/Input";
import { connect } from "~/renderer/screens/WalletConnect/Provider";

const Right = styled(Box).attrs(() => ({
  bg: "palette.background.default",
  px: 3,
  alignItems: "center",
  justifyContent: "center",
}))`
  border-top-right-radius: ${radii[1]}px;
  border-bottom-right-radius: ${radii[1]}px;
  border-left: 1px solid ${p => p.theme.colors.palette.divider};
  cursor: pointer;
`;

export default function StepPaste({ account, link, setLink }: StepProps) {
  const { t } = useTranslation();

  return (
    <Box flow={1}>
      <Label>
        <span>{t("walletconnect.steps.paste.label")}</span>
      </Label>
      {/* $FlowFixMe */}
      <Input
        placeholder={t("walletconnect.steps.paste.placeholder")}
        spellCheck="false"
        value={link}
        id="wc-paste-link"
        onChange={setLink}
        renderRight={
          <Right
            onClick={() => {
              setLink(clipboard.readText());
            }}
          >
            <IconPaste size={16} />
          </Right>
        }
      />
    </Box>
  );
}

export function StepPasteFooter({ link, setLink, transitionTo }: StepProps) {
  return (
    <Box horizontal justifyContent="flex-end">
      <Button
        onClick={() => {
          connect(link);
          transitionTo("confirm");
          setLink("");
        }}
        primary
        disabled={!link}
        id="wc-paste-link-continue"
      >
        Continue
      </Button>
    </Box>
  );
}
