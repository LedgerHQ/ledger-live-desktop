// @flow
import React, { useState } from "react";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Switch from "~/renderer/components/Switch";
import Label from "~/renderer/components/Label";
import { Trans, withTranslation } from "react-i18next";

import SelectFeeField from "./SelectFeeField";
import GasLimitField from "./GasLimitField";
import GasPriceField from "./GasPriceField";

const AdvancedText = styled(Text)`
  color: ${p =>
    p.selected ? p.theme.colors.palette.primary.main : p.theme.colors.palette.text.shade50};
  &:hover {
    cursor: pointer;
  }
`;

const Root = (props: *) => {
  const [isAdvanceMode, setAdvanceMode] = useState(false);

  return (
    <>
      <Box horizontal alignItems="center" justifyContent="flex-start" style={{ width: 200 }}>
        <Label>
          <span>
            <Trans i18nKey="Fees" />
          </span>
        </Label>
        <Box horizontal alignItems="center" style={{ marginLeft: "10px" }}>
          <Switch small isChecked={isAdvanceMode} onChange={() => setAdvanceMode(!isAdvanceMode)} />
          <AdvancedText
            ff="Inter|Medium"
            fontSize={10}
            selected={isAdvanceMode}
            style={{ paddingLeft: 5 }}
            onClick={() => setAdvanceMode(!isAdvanceMode)}
          >
            <Trans i18nKey="Advanced" />
          </AdvancedText>
        </Box>
      </Box>
      {isAdvanceMode ? (
        <>
          <GasPriceField {...props} />
          <GasLimitField {...props} />
        </>
      ) : (
        <SelectFeeField {...props} />
      )}
    </>
  );
};

export default {
  component: withTranslation()(Root),
  fields: ["fees", "gasLimit", "gasPrice"],
};
