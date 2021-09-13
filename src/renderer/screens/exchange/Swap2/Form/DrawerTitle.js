// @flow

import React from "react";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box/Box";
import { Separator } from "./Separator";
import Text from "~/renderer/components/Text";

export function DrawerTitle({ i18nKey }: { i18nKey: string }) {
  return (
    <>
      <Box horizontal justifyContent="center">
        <Text fontSize={6} fontWeight="600" ff="Inter" textTransform="capitalize">
          <Trans i18nKey={i18nKey} />
        </Text>
      </Box>
      <Separator />
    </>
  );
}
