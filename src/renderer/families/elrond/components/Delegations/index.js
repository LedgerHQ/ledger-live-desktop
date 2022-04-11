import React, { Fragment } from "react";
import { Trans } from "react-i18next";
import { Account as AccountType } from "@ledgerhq/live-common/lib/types";

import { HeaderWrapper } from "~/renderer/components/TableContainer";
import { TableLine } from "~/renderer/families/elrond/blocks/Delegation";
import { DelegationType, ValidatorType, UnbondingType } from "~/renderer/families/elrond/types";
import Delegation from "~/renderer/families/elrond/components/Delegations/components/Delegation";

type DelegationsType = {
  delegations: Array<DelegationType>,
  validators: Array<ValidatorType>,
  account: AccountType,
};

const Delegations = ({ delegations, validators, account }: DelegationsType) => (
  <Fragment>
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
        <Trans i18nKey="delegation.rewards" />
      </TableLine>
      <TableLine />
    </HeaderWrapper>

    {delegations.map(delegation => (
      <Delegation
        key={`delegation-${delegation.contract}`}
        delegations={delegations}
        validators={validators}
        account={account}
        {...delegation}
      />
    ))}
  </Fragment>
);

export default Delegations;
