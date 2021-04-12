// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import ToolTip from "~/renderer/components/Tooltip";
import InfoCircle from "~/renderer/icons/InfoCircle";

const TransactionConfirmField = ({
  children,
  label,
  tooltipKey,
  tooltipArgs,
}: {
  children?: React$Node,
  label: React$Node,
  tooltipKey?: string,
  tooltipArgs?: ?{ [key: string]: string },
}) => {
  const { t } = useTranslation();
  return (
    <Box horizontal justifyContent="space-between" mb={2}>
      <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={3} textAlign="center">
        {label}{" "}
        {tooltipKey ? (
          <ToolTip content={t(tooltipKey, tooltipArgs)}>
            <InfoCircle size={10} />
          </ToolTip>
        ) : null}
      </Text>
      {children}
    </Box>
  );
};

export default TransactionConfirmField;
