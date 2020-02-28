// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import { withTranslation } from "react-i18next";
import logger from "~/logger";
import type { TFunction } from "react-i18next";
import { hardReset } from "~/renderer/reset";
import ConfirmModal from "~/renderer/modals/ConfirmModal";
import ResetFallbackModal from "~/renderer/modals/ResetFallbackModal";
import SyncSkipUnderPriority from "~/renderer/components/SyncSkipUnderPriority";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import IconTriangleWarning from "~/renderer/icons/TriangleWarning";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

type Props = {
  t: TFunction,
};

type State = {
  opened: boolean,
  pending: boolean,
  fallbackOpened: boolean,
};

class ResetButton extends PureComponent<Props, State> {
  state = {
    opened: false,
    pending: false,
    fallbackOpened: false,
  };

  open = () => this.setState({ opened: true });
  close = () => this.setState({ opened: false });
  closeFallback = () => this.setState({ fallbackOpened: false });

  action = async () => {
    this.setState({ pending: true });
    try {
      await hardReset();
      window.api.reloadRenderer();
    } catch (err) {
      logger.error(err);
      this.setState({ pending: false, fallbackOpened: true });
    }
  };

  render() {
    const { t } = this.props;
    const { opened, pending, fallbackOpened } = this.state;

    return (
      <>
        <Button small danger onClick={this.open} event="HardResetIntent">
          {t("common.reset")}
        </Button>

        <ConfirmModal
          analyticsName="HardReset"
          isDanger
          centered
          isLoading={pending}
          isOpened={opened}
          onClose={this.close}
          onReject={this.close}
          onConfirm={this.action}
          confirmText={t("common.reset")}
          title={t("settings.hardResetModal.title")}
          desc={t("settings.hardResetModal.desc")}
          renderIcon={() => (
            // FIXME why not pass in directly the DOM 🤷🏻
            <IconWrapperCircle color="alertRed">
              <IconTriangleWarning width={23} height={21} />
            </IconWrapperCircle>
          )}
        >
          <SyncSkipUnderPriority priority={999} />
        </ConfirmModal>

        <ResetFallbackModal isOpened={fallbackOpened} onClose={this.closeFallback} />
      </>
    );
  }
}

export const IconWrapperCircle: ThemedComponent<{ color?: string }> = styled(Box)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #ea2e4919;
  align-items: center;
  justify-content: center;
`;

export default withTranslation()(ResetButton);
