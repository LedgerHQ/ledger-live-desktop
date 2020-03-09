// @flow
import React from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";

import { activeAccountsSelector } from "~/renderer/reducers/accounts";
import Box from "~/renderer/components/Box";
import QRCodeExporter from "~/renderer/components/Exporter/QRCodeExporter";
import ExportInstructions from "~/renderer/components/Exporter/ExportInstructions";
import type { Account } from "@ledgerhq/live-common/lib/types";

type OwnProps = {};
type Props = OwnProps & {
  accounts?: Account[],
};

const Exporter = ({ accounts }: Props) => (
  <Box justifyContent="center" alignItems="center">
    <Box flow={2}>
      <QRCodeExporter accounts={accounts} size={330} />
    </Box>
    <ExportInstructions />
  </Box>
);

const mapStateToProps = createStructuredSelector({
  accounts: (state, props) => props.accounts || activeAccountsSelector(state),
});

const ConnectedExporter: React$ComponentType<OwnProps> = connect(mapStateToProps)(Exporter);
export default ConnectedExporter;
