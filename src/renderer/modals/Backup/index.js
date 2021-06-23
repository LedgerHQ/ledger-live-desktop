// @flow
import React, { useCallback } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
// icons
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
import fs from "fs";
import moment from "moment";
import { reload } from "~/renderer/reset";
import Alert from "~/renderer/components/Alert";
import { hasPasswordSelector } from "~/renderer/reducers/application";
import { openURL } from "~/renderer/linking";

const userDataPath = resolveUserDataDirectory();
const userDataFile = path.resolve(userDataPath, "app.json");

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
  color: ${p =>
    p.disabled ? p.theme.colors.palette.text.shade20 : p.theme.colors.palette.primary.main};
  display: flex;
  align-items: center;
`;

const Item = ({
  Icon,
  title,
  desc,
  onClick,
  disabled,
}: {
  Icon: any,
  title: string,
  desc: string,
  onClick: () => void,
  disabled?: Boolean,
}) => {
  return (
    <ItemContainer onClick={disabled ? undefined : onClick} disabled={disabled}>
      <IconContainer disabled={disabled}>
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
  const hasPassword = useSelector(hasPasswordSelector);
  const history = useHistory();
  const goToSettings = useCallback(() => {
    onClose();
    history.push("/settings");
  }, [history]);
  return (
    <SideDrawer isOpen={isOpened} onRequestClose={onClose} direction="left">
      <>
        <TrackPage category="SideDrawer" name="Help" />
        <Box py={60} px={40}>
          <Text ff="Inter|SemiBold" fontSize={22} mb={20} color={"palette.text.shade100"}>
            Live in the Cloud
          </Text>
          {!hasPassword ? (
            <Alert
              type="warning"
              style={{ flexGrow: 0 }}
              learnMoreLabel="Go to Settings"
              onLearnMore={goToSettings}
            >
              <Text>
                For security reason, make sure that you have password lock enabled for you app
                before generating the backup file
              </Text>
            </Alert>
          ) : null}
          <ItemContainer>
            <Item
              disabled={!hasPassword}
              onClick={async () => {
                const toPath = await remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
                  title: "Exported user data",
                  defaultPath: `backup-Ledger-Live-${moment().format("YYYY.MM.DD")}.json`,
                  filters: [
                    {
                      name: "json Files",
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
              onClick={async () => {
                const backupFile = await remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
                  title: "Backup file to import",
                  properties: ["openFile"],
                  filters: [
                    {
                      name: "json Files",
                      extensions: ["json"],
                    },
                  ],
                });
                await fs.copyFile(backupFile.filePaths[0], `${userDataPath}/app.json`, err => {
                  console.log("Error: ", err);
                });
                reload();
              }}
              title={t("Restore your Live")}
              desc={t("Import your data live locally")}
              Icon={IconNano}
            />
          </ItemContainer>
          <ItemContainer>
            <Item
              disabled={!hasPassword}
              onClick={() =>
                openURL(
                  "https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=ddj3449medpklop&token_access_type=offline&code_challenge=Y7RzmicJ1Xc4Sn2ygfI7_lb2ZJsTkTCMEVHvT5hoGJg&code_challenge_method=S256",
                )
              }
              title={t("Backup with Dropbox")}
              desc={t("Connect Live with your Dropbox account")}
              Icon={IconDownloadCloud}
            />
          </ItemContainer>
        </Box>
      </>
    </SideDrawer>
  );
};
export default BackupSideDrawer;
