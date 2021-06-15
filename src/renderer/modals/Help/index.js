// @flow
import React from "react";
import styled from "styled-components";
import { Trans, useTranslation } from "react-i18next";
// icons
import IconHelp from "~/renderer/icons/Help";
import IconGithub from "~/renderer/icons/Github";
import IconTwitter from "~/renderer/icons/Twitter";
import IconActivity from "~/renderer/icons/Activity";
import IconFacebook from "~/renderer/icons/Facebook";
import IconBook from "~/renderer/icons/Book";
import IconNano from "~/renderer/icons/NanoAltSmall";
import IconChevronRight from "~/renderer/icons/ChevronRight";
import { openURL } from "~/renderer/linking";
import Text from "~/renderer/components/Text";
import TrackPage from "~/renderer/analytics/TrackPage";
import { SideDrawer } from "~/renderer/components/SideDrawer";
import Box from "~/renderer/components/Box";
import { urls } from "~/config/urls";

const ItemContainer = styled.a`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  text-decoration: none;
  &:not(:last-child) {
    border-bottom: 1px solid ${p => p.theme.colors.palette.divider};
  }
  & ${Box} svg {
    color: ${p => p.theme.colors.palette.text.shade50};
  }
  &:hover {
    filter: brightness(85%);
  }
  &:active {
    filter: brightness(60%);
  }
`;
const IconContainer = styled.div`
  color: ${p => p.theme.colors.palette.primary.main};
  display: flex;
  align-items: center;
`;
const Item = ({
  Icon,
  title,
  desc,
  url,
}: {
  Icon: any,
  title: string,
  desc: string,
  url: string,
}) => {
  return (
    <ItemContainer onClick={() => openURL(url)}>
      <IconContainer>
        <Icon size={24} />
      </IconContainer>
      <Box ml={12} flex={1}>
        <Text ff="Inter|SemiBold" fontSize={4} color={"palette.text.shade100"}>
          {title}
        </Text>
        <Text ff="Inter|Regular" fontSize={3} color={"palette.text.shade60"}>
          {desc}
        </Text>
      </Box>
      <Box>
        <IconChevronRight size={12} />
      </Box>
    </ItemContainer>
  );
};

const HelpSideDrawer = ({ isOpened, onClose }: { isOpened: boolean, onClose: () => void }) => {
  const { t } = useTranslation();
  return (
    <SideDrawer isOpen={isOpened} onRequestClose={onClose} direction="left">
      <>
        <TrackPage category="SideDrawer" name="Help" />

        <Box py={60} px={40}>
          <Text ff="Inter|SemiBold" fontSize={22} mb={20} color={"palette.text.shade100"}>
            <Trans i18nKey="help.title" />
          </Text>
          <Item
            title={t("help.gettingStarted.title")}
            desc={t("help.gettingStarted.desc")}
            url={urls.helpModal.gettingStarted}
            Icon={IconNano}
          />
          <Item
            title={t("help.helpCenter.title")}
            desc={t("help.helpCenter.desc")}
            url={urls.helpModal.helpCenter}
            Icon={IconHelp}
          />
          <Item
            title={t("help.ledgerAcademy.title")}
            desc={t("help.ledgerAcademy.desc")}
            url={urls.helpModal.ledgerAcademy}
            Icon={IconBook}
          />
          <Item
            title={t("help.facebook.title")}
            desc={t("help.facebook.desc")}
            url={urls.social.facebook}
            Icon={IconFacebook}
          />
          <Item
            title={t("help.twitter.title")}
            desc={t("help.twitter.desc")}
            url={urls.social.twitter}
            Icon={IconTwitter}
          />
          <Item
            title={t("help.github.title")}
            desc={t("help.github.desc")}
            url={urls.social.github}
            Icon={IconGithub}
          />
          <Item
            title={t("help.status.title")}
            desc={t("help.status.desc")}
            url={urls.helpModal.status}
            Icon={IconActivity}
          />
        </Box>
      </>
    </SideDrawer>
  );
};
export default HelpSideDrawer;
