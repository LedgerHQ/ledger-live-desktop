// @flow

import React from "react";
import Box from "~/renderer/components/Box";
import manager from "@ledgerhq/live-common/lib/manager";
import Image from "~/renderer/components/Image";
import Text from "~/renderer/components/Text";
import { Trans } from "react-i18next";
import Button from "~/renderer/components/Button";

const MissingOrOutdatedApp = ({
  appName,
  outdated = false,
  onOpenManager,
}: {
  appName: string,
  outdated?: boolean,
  onOpenManager: (appName: string) => void,
}) => {
  const key = outdated ? "outdatedApp" : "missingApp";
  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <Image
        alt="App icon"
        resource={manager.getIconUrl(appName.toLowerCase())}
        width={60}
        height={60}
      />
      <Text color="palette.text.shade100" mb={1} mt={3} ff="Inter|SemiBold" fontSize={5}>
        <Trans i18nKey={`swap.${key}.title`} values={{ appName }} />
      </Text>
      <Text color="palette.text.shade50" ff="Inter|Regular" fontSize={3}>
        <Trans i18nKey={`swap.${key}.subtitle`} values={{ appName }} />
      </Text>
      <Button mt={40} primary onClick={() => onOpenManager(appName)}>
        <Trans i18nKey={`swap.${key}.cta`} />
      </Button>
    </Box>
  );
};

export default MissingOrOutdatedApp;
