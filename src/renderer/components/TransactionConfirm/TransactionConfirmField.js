// @flow

import React from "react";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import ToolTip from "~/renderer/components/Tooltip";
import InfoCircle from "~/renderer/icons/InfoCircle";

const TransactionConfirmField = ({
  children,
  label,
  tooltipKey,
}: {
  children?: React$Node,
  label: React$Node,
  tooltipKey: ?string,
}) => (
  <Box horizontal justifyContent="space-between" mb={2}>
    <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={3} textAlign="center">
      {label}{" "}
      {tooltipKey ? (
        <ToolTip content={<Trans i18nKey={tooltipKey} />}>
          <InfoCircle size={10} />
        </ToolTip>
      ) : null}
    </Text>
    {children}
  </Box>
);

export default TransactionConfirmField;
