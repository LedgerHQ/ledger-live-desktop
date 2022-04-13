import React, { FC } from "react";
import { Trans } from "react-i18next";
import type { Account } from "@ledgerhq/live-common/lib/types";

import TableContainer, { HeaderWrapper, TableHeader } from "~/renderer/components/TableContainer";
import { UnbondingType } from "~/renderer/families/elrond/types";
import { TableLine } from "~/renderer/families/elrond/blocks/Delegation";
import Unbonding from "~/renderer/families/elrond/components/Unbondings/components/Unbonding";

type UnbondingsType = {
  unbondings: Array<UnbondingType>,
  account: Account,
};

const Unbondings: FC = (props: UnbondingsType) => {
  const { unbondings, account } = props;
  const columns = [
    "delegation.validator",
    "delegation.status",
    "delegation.delegated",
    "delegation.completionDate",
  ];

  return (
    <TableContainer mb={6}>
      <TableHeader
        title={<Trans i18nKey="elrond.undelegation.header" />}
        titleProps={{ "data-e2e": "title_Undelegation" }}
        tooltip={<Trans i18nKey="elrond.undelegation.headerTooltip" />}
      />

      <HeaderWrapper>
        {columns.map(column => (
          <TableLine key={column}>
            <Trans i18nKey={column} />
          </TableLine>
        ))}
      </HeaderWrapper>

      {unbondings.map((unbonding, index) => (
        <Unbonding
          key={`${unbonding.contract}-${index}`}
          account={account}
          unbondings={unbondings}
          {...unbonding}
        />
      ))}
    </TableContainer>
  );
};

export default Unbondings;
