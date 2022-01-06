// @flow
import React from "react";
import { Trans, withTranslation } from "react-i18next";
import MemoValueField from "./MemoValueField";
import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";

const Root = (props: *) => {
  return (
    <Box flow={1}>
      <Box mb={10}>
        <Label>
          <span>
            <Trans i18nKey="families.solana.memo" />
          </span>
        </Label>
      </Box>
      <Box mb={15} horizontal grow alignItems="center" justifyContent="space-between">
        <Box grow={1}>
          <MemoValueField {...props} />
        </Box>
      </Box>
    </Box>
  );
};

export default {
  component: withTranslation()(Root),
  fields: ["memo"],
};
