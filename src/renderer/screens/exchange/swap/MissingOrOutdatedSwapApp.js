// @flow

import React, { useCallback } from "react";
import Card from "~/renderer/components/Box/Card";
import manager from "@ledgerhq/live-common/lib/manager";
import TrackPage from "~/renderer/analytics/TrackPage";
import Image from "~/renderer/components/Image";
import Text from "~/renderer/components/Text";
import { Trans } from "react-i18next";
import Button from "~/renderer/components/Button";
import { useHistory } from "react-router-dom";

const MissingOrOutdatedSwapApp = ({ outdated = false }: { outdated?: boolean }) => {
  const { push } = useHistory();
  const openManager = useCallback(() => {
    push("manager?q=exchange");
  }, [push]);
  const key = outdated ? "outdatedApp" : "missingApp";
  return (
    <Card flex={1} p={89} alignItems="center" justifyContent="center">
      <TrackPage category="Swap" name="MissingOrOutdatedExchangeApp" />
      <Image alt="Swap app icon" resource={manager.getIconUrl("exchange")} width={60} height={60} />
      <Text color="palette.text.shade100" mb={1} mt={3} ff="Inter|SemiBold" fontSize={5}>
        <Trans i18nKey={`swap.${key}.title`} />
      </Text>
      <Text color="palette.text.shade50" ff="Inter|Regular" fontSize={3}>
        <Trans i18nKey={`swap.${key}.subtitle`} />
      </Text>
      <Button mt={40} primary onClick={openManager}>
        <Trans i18nKey={`swap.${key}.cta`} />
      </Button>
    </Card>
  );
};

export default MissingOrOutdatedSwapApp;
