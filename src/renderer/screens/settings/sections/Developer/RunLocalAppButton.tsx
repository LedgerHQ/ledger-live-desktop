import React, { useCallback } from "react";

import Button from "~/renderer/components/Button";
import { useTranslation } from "react-i18next";
import { remote } from "electron";
import { readFile } from "fs";
import { usePlatformApp } from "@ledgerhq/live-common/lib/platform/PlatformAppProvider/index";
import { SectionRow as Row } from "../../Rows";
import { useHistory } from "react-router-dom";
import { Flex } from "@ledgerhq/react-ui";

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
        <Button variant="main" onClick={onBrowseLocalManifest}>
          {t("settings.developer.addLocalAppButton")}
        </Button>
      </Row>
      {[...localManifests.values()].map(manifest => (
        <Row key={manifest.id} title={manifest.name} desc={manifest.url}>
          <Flex>
            <Button variant="main" onClick={() => history.push(`/platform/${manifest.id}`)}>
              {t("settings.developer.runLocalAppOpenButton")}
            </Button>
            <Button variant="error" onClick={() => removeLocalManifest(manifest.id)} ml={5}>
              {t("settings.developer.runLocalAppDeleteButton")}
            </Button>
          </Flex>
        </Row>
      ))}
    </>
  );
};

export default RunLocalAppButton;
