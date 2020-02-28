// @flow

import React from "react";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";

type Props = {
  ff?: string | number,
  ffBold?: string | number,
  isBold: boolean,
  children: any,
};

function BoldToggle(props: Props) {
  const { ff, ffBold, isBold, children } = props;
  return (
    <Box relative>
      <Text ff={ffBold} style={{ opacity: isBold ? 1 : 0 }}>
        {children}
      </Text>
      {!isBold && (
        <Box sticky alignItems="center" justifyContent="center">
          <Text ff={ff}>{children}</Text>
        </Box>
      )}
    </Box>
  );
}

BoldToggle.defaultProps = {
  ff: "Inter",
  ffBold: "Inter|SemiBold",
};

export default BoldToggle;
