import React, { FC } from "react";
import { Trans } from "react-i18next";

import TableContainer, { HeaderWrapper, TableHeader } from "~/renderer/components/TableContainer";
import { UnbondingType } from "~/renderer/families/elrond/types";
import { TableLine } from "~/renderer/families/elrond/blocks/Delegation";
import Unbonding from "~/renderer/families/elrond/components/Unbondings/components/Unbonding";

type UnbondingsType = {
  unbondings: Array<UnbondingType>,
};

const Unbondings: FC = ({ unbondings }: UnbondingsType) => (
  <TableContainer mb={6}>
    <TableHeader
      title={<Trans i18nKey="cosmos.undelegation.header" />}
      titleProps={{ "data-e2e": "title_Undelegation" }}
      tooltip={<Trans i18nKey="cosmos.undelegation.headerTooltip" />}
    />

    <HeaderWrapper>
      <TableLine>
        <Trans i18nKey="delegation.validator" />
      </TableLine>
      <TableLine>
        <Trans i18nKey="delegation.status" />
      </TableLine>
      <TableLine>
        <Trans i18nKey="delegation.delegated" />
      </TableLine>
      <TableLine>
        <Trans i18nKey="delegation.completionDate" />
      </TableLine>
    </HeaderWrapper>

    {unbondings.map((unbonding, index) => (
      <Unbonding key={`${unbonding.contract}-${index}`} {...unbonding} />
    ))}
  </TableContainer>
);

export default Unbondings;
