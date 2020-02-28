// @flow

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import type { AccountPortfolio } from "@ledgerhq/live-common/lib/types";

import { balanceHistoryWithCountervalueSelector } from "~/renderer/actions/portfolio";
import Box from "~/renderer/components/Box";
import FormattedVal from "~/renderer/components/FormattedVal";
import { PlaceholderLine } from "~/renderer/components/Placeholder";

class Delta extends PureComponent<{
  histo: AccountPortfolio,
}> {
  render() {
    const {
      histo: { countervalueChange },
    } = this.props;
    return (
      <Box flex="10%" justifyContent="flex-end">
        {!countervalueChange.percentage ? (
          <PlaceholderLine width={16} height={2} />
        ) : (
          <FormattedVal
            isPercent
            val={countervalueChange.percentage.times(100).integerValue()}
            alwaysShowSign
            fontSize={3}
          />
        )}
      </Box>
    );
  }
}

const ConnectedDelta: React$ComponentType<{}> = connect(
  createStructuredSelector({
    histo: balanceHistoryWithCountervalueSelector,
  }),
)(Delta);

export default ConnectedDelta;
