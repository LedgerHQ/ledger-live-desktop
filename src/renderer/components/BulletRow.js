// @flow

import React from "react";
import Box from "~/renderer/components/Box";
import { OptionRowDesc } from "~/renderer/components/OptionRow";

type StepType = {
  icon: any,
  desc: any,
};

const BulletRow = ({ step, ...p }: { step: StepType }) => {
  const { icon, desc } = step;
  return (
    <Box horizontal my="7px">
      <Box {...p} mr="7px">
        {icon}
      </Box>
      <Box justifyContent="center" shrink>
        <OptionRowDesc>{desc}</OptionRowDesc>
      </Box>
    </Box>
  );
};

export default BulletRow;
