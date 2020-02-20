// @flow

import React, { PureComponent } from "react";
import moment from "moment";
import { withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import Box from "./Box";

class SyncAgo extends PureComponent<{ t: TFunction, date: Date }> {
  render() {
    const { t, date } = this.props;
    return <Box p={4}>{t("common.sync.ago", { time: moment(date).fromNow() })}</Box>;
  }
}

export default withTranslation()(SyncAgo);
