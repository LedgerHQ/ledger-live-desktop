// @flow

import React, { PureComponent } from "react";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import logger from "~/logger";
import type { TFunction } from "react-i18next";
import { command } from "~/renderer/commands";
import Button from "~/renderer/components/Button";
import RepairModal from "~/renderer/modals/RepairModal";

type OwnProps = {
  buttonProps?: *,
  onRepair?: boolean => void,
};

type Props = OwnProps & {
  t: TFunction,
  history: *,
};

type State = {
  opened: boolean,
  isLoading: boolean,
  error: ?Error,
  progress: number,
};

class RepairDeviceButton extends PureComponent<Props, State> {
  state = {
    opened: false,
    isLoading: false,
    error: null,
    progress: 0,
  };

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    if (this.sub) this.sub.unsubscribe();
  }

  open = () => this.setState({ opened: true, error: null });

  sub: *;
  timeout: *;

  close = () => {
    const { onRepair } = this.props;
    if (this.sub) this.sub.unsubscribe();
    if (this.timeout) clearTimeout(this.timeout);
    if (onRepair) {
      onRepair(false);
    }
    this.setState({ opened: false, isLoading: false, error: null, progress: 0 });
  };

  repair = (version = null) => {
    if (this.state.isLoading) return;
    const { history, onRepair } = this.props;
    if (onRepair) {
      onRepair(true);
    }
    this.timeout = setTimeout(() => this.setState({ isLoading: true }), 500);
    this.sub = command("firmwareRepair")({ version }).subscribe({
      next: patch => {
        this.setState(patch);
      },
      error: error => {
        logger.critical(error);
        if (this.timeout) clearTimeout(this.timeout);
        this.setState({ error, isLoading: false, progress: 0 });
      },
      complete: () => {
        if (this.timeout) clearTimeout(this.timeout);
        this.setState({ opened: false, isLoading: false, progress: 0 }, () => {
          history.push({ pathname: "/manager", state: { source: "settings help repair device" } });
        });
        if (onRepair) {
          onRepair(false);
        }
      },
    });
  };

  render() {
    const { t, buttonProps } = this.props;
    const { opened, isLoading, error, progress } = this.state;

    return (
      <>
        <Button {...buttonProps} primary onClick={this.open} event="RepairDeviceButton">
          {t("settings.repairDevice.button")}
        </Button>

        <RepairModal
          cancellable
          analyticsName="RepairDevice"
          isOpened={opened}
          onClose={this.close}
          onReject={this.close}
          repair={this.repair}
          isLoading={isLoading}
          title={t("settings.repairDevice.title")}
          desc={t("settings.repairDevice.desc")}
          progress={progress}
          error={error}
        />
      </>
    );
  }
}

const RepairDeviceButtonOut: React$ComponentType<OwnProps> = compose(
  withTranslation(),
  withRouter,
)(RepairDeviceButton);

export default RepairDeviceButtonOut;
