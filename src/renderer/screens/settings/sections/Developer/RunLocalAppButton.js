// @flow
import React, { useCallback } from "react";

import Button from "~/renderer/components/Button";
import { useTranslation } from "react-i18next";
import { remote } from "electron";
import { readFile } from "fs";
import { usePlatformApp } from "@ledgerhq/live-common/lib/platform/PlatformAppProvider/index";
import { SettingsSectionRow as Row } from "../../SettingsSection";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const RunLocalAppButton = () => {
  const { t } = useTranslation();
  const { addLocalManifest, localManifests, removeLocalManifest } = usePlatformApp();
  const history = useHistory();

  const onBrowseLocalManifest = useCallback(() => {
    remote.dialog.showOpenDialog({ properties: ["openFile"] }).then(function(response) {
      if (!response.canceled) {
        const fileName = response.filePaths[0];
        readFile(fileName, (readError, data) => {
          if (!readError) {
            try {
              const manifest = JSON.parse(data.toString());

              Array.isArray(manifest)
                ? manifest.forEach(m => addLocalManifest(m))
                : addLocalManifest(manifest);
            } catch (parseError) {
              console.log(parseError);
            }
          }
        });
      } else {
        console.log("no file selected");
      }
    });
  }, [addLocalManifest]);

  return (
    <>
      <Row
        title={t("settings.developer.addLocalApp")}
        desc={t("settings.developer.addLocalAppDesc")}
      >
        <Button
          small
          primary
          onClick={onBrowseLocalManifest}
          data-test-id="settings-enable-platform-dev-tools-apps"
        >
          {t("settings.developer.addLocalAppButton")}
        </Button>
      </Row>
      {[...localManifests.values()].map(manifest => (
        <Row key={manifest.id} title={manifest.name} desc={manifest.url}>
          <ButtonContainer>
            <Button small primary onClick={() => history.push(`/platform/${manifest.id}`)}>
              {t("settings.developer.runLocalAppOpenButton")}
            </Button>
            <Button
              small
              danger
              onClick={() => removeLocalManifest(manifest.id)}
              style={{ marginLeft: 8 }}
            >
              {t("settings.developer.runLocalAppDeleteButton")}
            </Button>
          </ButtonContainer>
        </Row>
      ))}
    </>
  );
};

export default RunLocalAppButton;
