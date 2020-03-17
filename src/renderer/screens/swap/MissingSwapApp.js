// @flow

import React, { useCallback } from "react";
import Card from "~/renderer/components/Box/Card";
import manager from "@ledgerhq/live-common/lib/manager";
import Image from "~/renderer/components/Image";
import Text from "~/renderer/components/Text";
import { Trans } from "react-i18next";
import Button from "~/renderer/components/Button";
import { useHistory } from "react-router-dom";

const MissingSwapApp = () => {
  const { push } = useHistory();
  const openManager = useCallback(() => {
    push("/manager");
  }, [push]);

  // FIXME replace with swap app icon once we have it in the manager
  return (
    <Card p={89} alignItems="center">
      <Image
        alt="Swap app icon"
        resource={manager.getIconUrl("https://api.ledgerwallet.com/update/assets/icons/bitcoin")}
        width={60}
        height={60}
      />
      <Text color="palette.text.shade100" mb={1} mt={3} ff="Inter|SemiBold" fontSize={5}>
        <Trans i18nKey={"swap.missingApp.title"} />
      </Text>
      <Text color="palette.text.shade50" ff="Inter|Regular" fontSize={3}>
        <Trans i18nKey={"swap.missingApp.subtitle"} />
      </Text>
      <Button mt={40} primary onClick={openManager}>
        <Trans i18nKey={"swap.missingApp.cta"} />
      </Button>
    </Card>
  );
};

export default MissingSwapApp;
