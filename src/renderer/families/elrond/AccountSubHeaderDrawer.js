// @flow
import React from "react";
import styled from "styled-components";
import { Trans, useTranslation } from "react-i18next";
import { SideDrawer } from "~/renderer/components/SideDrawer";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";

type Props = {
  isOpen: boolean,
  closeDrawer: () => void,
};

const Title = styled(Text)`
  font-style: normal;
  font-weight: 600;
  font-size: 22px;
  line-height: 27px;
`;

const Divider = styled(Box)`
  border: 1px solid #f5f5f5;
`;

const LinkTitle = styled(Text)`
  font-weight: 600;
  font-size: 13px;
`;

const Description = styled(Text)`
  font-size: 13px;
`;

export function AccountSubHeaderDrawer({ isOpen, closeDrawer }: Props) {
  const { t } = useTranslation();
  return (
    <SideDrawer
      title={t("elrond.account.subHeader.drawerTitle")}
      isOpen={isOpen}
      onRequestClose={closeDrawer}
      direction="left"
    >
      <Box px={40} py={60}>
        <Title>{t("elrond.account.subHeader.title")}</Title>
        <Box py={3}>
          <Description>{t("elrond.account.subHeader.description")}</Description>
        </Box>
        <Box py={2}>
          <Description>{t("elrond.account.subHeader.description2")}</Description>
        </Box>
        <Box py={2}>
          <Description>{t("elrond.account.subHeader.description3")}</Description>
        </Box>
        <Divider mt={2} />
        <Box mt={3}>
          <LinkTitle>{t("elrond.account.subHeader.website.title")}</LinkTitle>
          <LinkWithExternalIcon
            label={<Trans i18nKey="elrond.account.subHeader.website.linkTitle" />}
            onClick={() => openURL(urls.elrond.website)}
          />
        </Box>
        <Box mt={2}>
          <LinkTitle>{t("elrond.account.subHeader.github.title")}</LinkTitle>
          <LinkWithExternalIcon
            label={<Trans i18nKey="elrond.account.subHeader.github.linkTitle" />}
            onClick={() => openURL(urls.elrond.github)}
          />
        </Box>
        <Box mt={2}>
          <LinkTitle>{t("elrond.account.subHeader.twitter.title")}</LinkTitle>
          <LinkWithExternalIcon
            label={<Trans i18nKey="elrond.account.subHeader.twitter.linkTitle" />}
            onClick={() => openURL(urls.elrond.twitter)}
          />
        </Box>
      </Box>
    </SideDrawer>
  );
}

export default AccountSubHeaderDrawer;
