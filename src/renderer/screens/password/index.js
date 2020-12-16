// @flow
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import type { RouterHistory, Match, Location } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openModal } from "~/renderer/actions/modals";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import TrackPage from "~/renderer/analytics/TrackPage";
import IconLock from "~/renderer/icons/Lock";
import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from "../settings/SettingsSection";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/app";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";
import DeviceAction from "~/renderer/components/DeviceAction";
import { command } from "~/renderer/commands";
import { mockedEventEmitter } from "~/renderer/components/DebugMock";
import { getEnv } from "@ledgerhq/live-common/lib/env";

type Props = {
  history: RouterHistory,
  location: Location,
  match: Match,
};

const connectApp = command("connectApp");
const action = createAction(getEnv("MOCK") ? mockedEventEmitter : connectApp);

// Props are passed from the <Route /> component in <Default />
const Password = ({ history, location, match }: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onAddPassword = useCallback(
    (e: SyntheticEvent<HTMLButtonElement>) => {
      e.preventDefault();
      // TODO: Modal release notes
      dispatch(openModal("MODAL_PASSWORD_ADD_PASSWORD"));
    },
    [dispatch],
  );

  const [result, setResult] = useState(null);

  return (
    <>
      <SyncSkipUnderPriority priority={999} />
      {result ? (
        <Box pb={4} selectable>
          <Box
            ff="Inter|SemiBold"
            color="palette.text.shade100"
            fontSize={7}
            mb={5}
            data-e2e="password_title"
            justifyContent="space-between"
            horizontal
          >
            {t("llpassword.title")}
            <Button event="Add" small primary onClick={onAddPassword}>
              {t("llpassword.add")}
            </Button>
          </Box>
          <Section>
            <TrackPage category="Password" name="Index" />

            <Header
              icon={<IconLock size={16} />}
              title={t("llpassword.title")}
              desc={t("llpassword.desc")}
            />

            <Body>
              <Row title="Password name" desc="password desc">
                <Button event="Copy passwd" small primary onClick={() => {}}>
                  {t("llpassword.copy")}
                </Button>
              </Row>
            </Body>
          </Section>
        </Box>
      ) : (
        <DeviceAction
          onResult={setResult}
          action={action}
          request={{
            appName: "Bitcoin",
          }}
        />
      )}
    </>
  );
};
export default Password;
