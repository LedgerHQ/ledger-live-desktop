// @flow

import React from "react";

import Box from "~/renderer/components/Box";
import Tooltip from "~/renderer/components/Tooltip";
import IconInfoCircle from "~/renderer/icons/InfoCircle";

type Props = {
  text: string,
};

function LabelInfoTooltip(props: Props) {
  const { text, ...p } = props;
  return (
    <Box {...p}>
      <Tooltip content={text} style={{ height: 12 }}>
        <IconInfoCircle size={12} />
      </Tooltip>
    </Box>
  );
}

export default React.memo<Props>(LabelInfoTooltip, (prev, next) => prev.text === next.text);
