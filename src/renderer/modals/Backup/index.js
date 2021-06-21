// @flow
import React, {useCallback} from "react";
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
//import DropboxFrame from ".DropboxFrame";



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
}: {
  Icon: any,
  title: string,
  desc: string,
  url: string,
}) => {
  return (
    <ItemContainer>
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

const BackupSideDrawer = ({ isOpened, onClose }: { isOpened: boolean, onClose: () => void }) => {
  const { t } = useTranslation();
  return (
    <SideDrawer isOpen={isOpened} onRequestClose={onClose} direction="left">
      <>
        <TrackPage category="SideDrawer" name="Help" />

        <Box py={60} px={40}>
          <Text ff="Inter|SemiBold" fontSize={22} mb={20} color={"palette.text.shade100"}>
            LIVE-IN-THE-CLOUD
          </Text>
          <ItemContainer>
            <Item
              title={t("Back up your Live")}
              desc={t("Save your data locally")}
              Icon={IconHelp}
            />
          </ItemContainer>
          <ItemContainer>
            <Item
              title={t("Restore your Live")}
              desc={t("Import your data live locally")}
              Icon={IconHelp}
            />
          </ItemContainer>
          <ItemContainer>
            <Item
              title={t("Backup with Dropbox")}
              desc={t("Connect Live with your Dropbox account")}
              Icon={IconHelp}
            />
          </ItemContainer>
        </Box>
      </>
    </SideDrawer>
  );
};
export default BackupSideDrawer;
