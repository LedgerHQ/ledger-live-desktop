// @flow
import React from "react";
import { Trans, withTranslation } from "react-i18next";
import MemoTypeField from "./MemoTypeField";
import MemoValueField from "./MemoValueField";
import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";
import Text from "~/renderer/components/Text";

const Root = (props: *) => (
    <Box flow={1}>
        <Box mb={10}>
            <Label>
                <span>
                    <Trans i18nKey="send.steps.details.stellarMemo" />
                </span>
            </Label>
            <Text ff="Inter|Regular" color="palette.text.shade50" fontSize={4}>
                <Trans i18nKey="send.steps.warning.stellar.text" />
            </Text>
        </Box>
        <Box mb={30} horizontal grow alignItems="center" justifyContent="space-between">
            <MemoTypeField {...props} />
            {props.transaction.memoType && props.transaction.memoType !== "NO_MEMO" && (
                <Box ml={20} grow={1}>
                    <MemoValueField {...props} />
                </Box>
            )}
        </Box>
    </Box>
);

export default {
    component: withTranslation()(Root),
    // Transaction is used here to prevent user to forward
    // If he format a memo incorrectly
    fields: ["memoType", "transaction"],
};