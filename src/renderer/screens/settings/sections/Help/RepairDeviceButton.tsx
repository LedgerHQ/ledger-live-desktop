import React, { PureComponent } from "react";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import logger from "~/logger";
import type { TFunction } from "react-i18next";
import { command } from "~/renderer/commands";
import Button, { Props as ButtonProps } from "~/renderer/components/Button";
import RepairModal from "~/renderer/modals/RepairModal";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";

// TODO: migrate to functional component


type OwnProps = {
  buttonProps?: ButtonProps,
  onRepair?: (repair: boolean) => void,
};

type Props = OwnProps & {
  t: TFunction,
  history: any,
};

type State = {
  opened: boolean,
  isLoading: boolean,
  error?: Error,
  progress: number,
};

class RepairDeviceButton extends PureComponent<Props, State> {
  state = {
    opened: false,
    isLoading: false,
    error: undefined,
    progress: 0,
  };

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    if (this.sub) this.sub.unsubscribe();
  }

  open = () => this.setState({ opened: true, error: undefined });

  sub: any;
  timeout: any;

  close = () => {
    const { onRepair } = this.props;
    if (this.sub) this.sub.unsubscribe();
    if (this.timeout) clearTimeout(this.timeout);
    if (onRepair) {
      onRepair(false);
    }
    this.setState({ opened: false, isLoading: false, error: undefined, progress: 0 });
  };

  repair = (version?: string) => {
    if (this.state.isLoading) return;
    const { history, onRepair } = this.props;
    if (onRepair) {
      onRepair(true);
    }
    this.timeout = setTimeout(() => this.setState({ isLoading: true }), 500);
    this.sub = command("firmwareRepair")({ version: version ?? null }).subscribe({
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
          setTrackingSource("settings help repair device");
          history.push({ pathname: "/manager" });
        });
        if (onRepair) {
          onRepair(false);
        }
      },
    });
  };

  render() {
    const { t } = this.props;
    const { opened, isLoading, error, progress } = this.state;

    return (
      <>
        <Button variant="main" onClick={this.open} event="RepairDeviceButton" style={{ width: "120px" }}>
          {t("settings.repairDevice.button")}
        </Button>

        <RepairModal
          cancellable
          analyticsName="RepairDevice"
          isOpened={opened}
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

const RepairDeviceButtonOut = compose<React.ComponentType<OwnProps>>(
  withTranslation(),
  withRouter,
)(RepairDeviceButton);

export default RepairDeviceButtonOut;
