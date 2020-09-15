// @flow

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import logger from "~/logger";
import { softReset } from "~/renderer/reset";
import { cleanAccountsCache } from "~/renderer/actions/accounts";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";
import Button from "~/renderer/components/Button";
import ConfirmModal from "~/renderer/modals/ConfirmModal";
import ResetFallbackModal from "~/renderer/modals/ResetFallbackModal";

const mapDispatchToProps = {
  cleanAccountsCache,
};

type Props = {
  t: TFunction,
  cleanAccountsCache: () => *,
};

type State = {
  opened: boolean,
  fallbackOpened: boolean,
  isLoading: boolean,
};

class CleanButton extends PureComponent<Props, State> {
  state = {
    opened: false,
    fallbackOpened: false,
    isLoading: false,
  };

  open = () => this.setState({ opened: true });

  close = () => this.setState({ opened: false });
  closeFallback = () => this.setState({ fallbackOpened: false });

  action = async () => {
    if (this.state.isLoading) return;
    try {
      this.setState({ isLoading: true });
      await softReset({ cleanAccountsCache: this.props.cleanAccountsCache });
    } catch (err) {
      logger.error(err);
      this.setState({ isLoading: false, fallbackOpened: true });
    }
  };

  render() {
    const { t } = this.props;
    const { opened, isLoading, fallbackOpened } = this.state;
    return (
      <>
        <Button small primary onClick={this.open} event="ClearCacheIntent">
          {t("settings.profile.softReset")}
        </Button>

        <ConfirmModal
          analyticsName="CleanCache"
          centered
          isOpened={opened}
          onClose={this.close}
          onReject={this.close}
          onConfirm={this.action}
          isLoading={isLoading}
          title={t("settings.softResetModal.title")}
          subTitle={t("common.areYouSure")}
          desc={t("settings.softResetModal.desc")}
        >
          <SyncSkipUnderPriority priority={999} />
        </ConfirmModal>

        <ResetFallbackModal isOpened={fallbackOpened} onClose={this.closeFallback} />
      </>
    );
  }
}

const CleanButtonOut: React$ComponentType<{}> = withTranslation()(
  connect(null, mapDispatchToProps)(CleanButton),
);

export default CleanButtonOut;
