// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { SettingsSectionHeader as Header } from "~/renderer/screens/settings/SettingsSection";
import IconServer from "~/renderer/icons/Server";
import Box from "~/renderer/components/Box";
import FullNodeButton from "./FullNodeButton";
import FullNodeStatus from "./FullNodeStatus";

export const HideIfEmptyBox: ThemedComponent<{}> = styled(Box)`
  &:empty {
    display: none;
  }
`;

const FullNode = () => {
  const { t } = useTranslation();
  return (
    <>
      <Header
        icon={<IconServer />}
        title={t("settings.accounts.fullNode.title")}
        desc={t("settings.accounts.fullNode.desc")}
        renderRight={<FullNodeButton />}
      />
      <HideIfEmptyBox p={2}>
        <FullNodeStatus />
      </HideIfEmptyBox>
    </>
  );
};

export default FullNode;
