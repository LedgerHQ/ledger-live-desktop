import React from "react";

import { Trans, useTranslation } from "react-i18next";
import { openURL } from "~/renderer/linking";
import { useFilteredServiceStatus } from "@ledgerhq/live-common/lib/notifications/ServiceStatusProvider";
import type { Incident } from "@ledgerhq/live-common/lib/notifications/ServiceStatusProvider/types";

import { Flex, StatusNotification, Notification, Icons, IconBox, Badge, Text } from "@ledgerhq/react-ui";
import { FakeLink } from "~/renderer/components/Link";
import { urls } from "~/config/urls";

function StatusOkHeader() {
  const { t } = useTranslation();

  return (
    <Flex py="32px" alignItems="center" justifyContent="center" flexDirection="column" flex={1}>
      <StatusNotification text={t("informationCenter.serviceStatus.statusOk.title")} badge={
          (<IconBox>
            <Icons.CircledCheckMedium size={24} color="palette.success.c100" />
          </IconBox>)
        } />
      <Text
        color="palette.neutral.c100"
        variant="paragraph"
      >
        <Trans i18nKey="informationCenter.serviceStatus.statusOk.description">
          <FakeLink onClick={() => openURL(urls.ledgerStatus)} />
        </Trans>
      </Text>
    </Flex>
  );
}

function StatusNotOkHeader({ incidents }: { incidents: Incident[] }) {
  const { t } = useTranslation();

  const NotOkBadge = <Badge backgroundColor="palette.warning.c40" icon={<Icons.WarningMedium color="palette.warning.c100" />} />;
  return (
      <Flex py="32px" alignItems="center" justifyContent="center" flexDirection="column" flex={1}>
        <StatusNotification text={t("informationCenter.serviceStatus.statusNotOk.title")} badge={
          (<IconBox>
            <Icons.WarningMedium size={24} color="palette.warning.c100" />
          </IconBox>)
        } />
        {
          incidents.map(({ name, incident_updates: incidentUpdates, shortlink }) =>
           (
              <Notification
                badge={NotOkBadge}
                title={name}                
                description={incidentUpdates?.map(i => i.body).join("\n")}
                link={t("informationCenter.serviceStatus.statusNotOk.learnMore")}
                onLinkClick={() => shortlink && openURL(shortlink)}
              />           
            )
          )
        }
      </Flex>
  );
}

function ServiceStatusPanel() {
  const { incidents } = useFilteredServiceStatus();

  return incidents.length > 0 ? <StatusNotOkHeader incidents={incidents} /> : <StatusOkHeader />;
}


export default ServiceStatusPanel;