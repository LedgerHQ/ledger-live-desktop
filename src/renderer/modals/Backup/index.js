// @flow
import React, {useCallback} from "react";
import styled from "styled-components";
import { Trans, useTranslation } from "react-i18next";
// icons
import IconHelp from "~/renderer/icons/Help";
import IconBook from "~/renderer/icons/Book";
import IconNano from "~/renderer/icons/NanoAltSmall";
import IconDownloadCloud from "~/renderer/icons/DownloadCloud";
import IconChevronRight from "~/renderer/icons/ChevronRight";
import Text from "~/renderer/components/Text";
import TrackPage from "~/renderer/analytics/TrackPage";
import { SideDrawer } from "~/renderer/components/SideDrawer";
import Box from "~/renderer/components/Box";
import resolveUserDataDirectory from "~/helpers/resolveUserDataDirectory.js";
import { ipcRenderer, remote } from "electron";
import path from "path";
import moment from "moment";
import { openURL } from "~/renderer/linking";

const userDataPath = resolveUserDataDirectory();
const userDataFile = path.resolve(userDataPath, "app.json");

const exportBackup = async (
  fromPath: { canceled: Boolean, filePath: string },
  toPath: { canceled: Boolean, filePath: string },
  callback?: () => void,
) => {
  try {
    const res = await ipcRenderer.invoke("export-backup", fromPath, toPath);
    if (res && callback) {
      callback();
    }
  } catch (error) {}
};

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
  onClick,
}: {
  Icon: any,
  title: string,
  desc: string,
  onClick: () => void,
}) => {
  return (
    <ItemContainer onClick={onClick}>
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

const Item2 = ({
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
              onClick={async () => {
                console.log(userDataFile);
                const toPath = await remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
                  title: "Exported user data",
                  defaultPath: `backup-Ledger-Live-${moment().format("YYYY.MM.DD")}.json`,
                  filters: [
                    {
                      name: "All Files",
                      extensions: ["json"],
                    },
                  ],
                });
                if (toPath) {
                ipcRenderer.invoke("export-backup", userDataFile, toPath);
                }
              }}
              title={t("Back up your Live")}
              desc={t("Save your data locally")}
              Icon={IconBook}
            />
          </ItemContainer>
          <ItemContainer>
            <Item
              title={t("Restore your Live")}
              desc={t("Import your data live locally")}
              Icon={IconNano}
            />
          </ItemContainer>
          <ItemContainer>
            <Item2
              title={t("Backup with Dropbox")}
              desc={t("Connect Live with your Dropbox account")}
              Icon={IconDownloadCloud}
              url={"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
            />
          </ItemContainer>
        </Box>
      </>
    </SideDrawer>
  );
};
export default BackupSideDrawer;
