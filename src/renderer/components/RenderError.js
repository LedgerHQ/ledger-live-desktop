// @flow
import React, { PureComponent } from "react";
import styled from "styled-components";
import { withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import Image from "~/renderer/components/Image";
import OpenUserDataDirectoryBtn from "~/renderer/components/OpenUserDataDirectoryBtn";
import CrashScreen from "~/renderer/images/crash-screen.svg";
import IconTriangleWarning from "~/renderer/icons/TriangleWarning";
import { hardReset } from "~/renderer/reset";
import TriggerAppReady from "./TriggerAppReady";
import ExportLogsButton from "./ExportLogsButton";
import Box from "~/renderer/components/Box";
import Space from "~/renderer/components/Space";
import Button from "~/renderer/components/Button";
import ConfirmModal from "~/renderer/modals/ConfirmModal";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const printError = (error: mixed) => {
  const print = [];

  if (!error) {
    return "bad error";
  }

  if (error.message) {
    print.push(error.message);
  }

  if (error.stack) {
    print.push(error.stack);
  } else {
    if (error.name) {
      print.push(error.name);
    }
    print.push("no call stack available :(");
  }

  return print.join("\n");
};

type Props = {
  error: Error,
  t: TFunction,
  withoutAppData?: boolean,
  children?: *,
};

class Unsafe extends PureComponent<*, *> {
  state = {
    error: null,
  };

  componentDidCatch(error) {
    this.setState({ error });
  }

  render() {
    const { children } = this.props;
    const { error } = this.state;
    if (error) {
      return null;
    }
    return children;
  }
}

class RenderError extends PureComponent<
  Props,
  { isHardResetting: boolean, isHardResetModalOpened: boolean },
> {
  state = {
    isHardResetting: false,
    isHardResetModalOpened: false,
  };

  handleOpenHardResetModal = () => this.setState({ isHardResetModalOpened: true });

  handleCloseHardResetModal = () => this.setState({ isHardResetModalOpened: false });

  troubleshootingCrash = () => {
    openURL(urls.troubleshootingCrash);
  };

  hardResetIconRender = () => (
    <IconWrapperCircle color="alertRed">
      <IconTriangleWarning width={23} height={21} />
    </IconWrapperCircle>
  );

  handleHardReset = async () => {
    this.setState({ isHardResetting: true });
    try {
      await hardReset();
      window.api.reloadRenderer();
    } catch (err) {
      this.setState({ isHardResetting: false });
    }
  };

  render() {
    const { error, t, withoutAppData, children } = this.props;
    const { isHardResetting, isHardResetModalOpened } = this.state;
    return (
      <Box alignItems="center" grow bg="palette.background.default">
        <TriggerAppReady />
        <Space of={100} />
        <Image alt="" resource={CrashScreen} width="200" />
        <Space of={40} />
        <Box ff="Inter|SemiBold" fontSize={6} color="palette.text.shade100">
          {t("crash.title")}
        </Box>
        <Space of={15} />
        <Box
          style={{ width: 500 }}
          textAlign="center"
          alignItems="center"
          ff="Inter|Regular"
          color="palette.text.shade80"
          fontSize={4}
        >
          {t("crash.description")}
        </Box>
        <Box py={6}>
          <Button primary onClick={this.troubleshootingCrash}>
            {t("crash.troubleshooting")}
          </Button>
        </Box>
        <Box horizontal flow={2}>
          <ExportLogsButton
            primary={false}
            title={t("crash.logs")}
            withoutAppData={withoutAppData}
          />
          <OpenUserDataDirectoryBtn primary={false} title={t("crash.dataFolder")} />
          <Unsafe>
            <Button lighterDanger onClick={this.handleOpenHardResetModal}>
              {t("common.reset")}
            </Button>
            <ConfirmModal
              analyticsName="HardReset"
              isDanger
              isLoading={isHardResetting}
              isOpened={isHardResetModalOpened}
              onClose={this.handleCloseHardResetModal}
              onReject={this.handleCloseHardResetModal}
              onConfirm={this.handleHardReset}
              confirmText={t("common.reset")}
              title={t("settings.hardResetModal.title")}
              desc={t("settings.hardResetModal.desc")}
              renderIcon={this.hardResetIconRender}
            />
          </Unsafe>
        </Box>
        <Box my={6} color="palette.text.shade80">
          <ErrContainer>{printError(error)}</ErrContainer>
        </Box>
        <VersionContainer>{`Ledger Live ${__APP_VERSION__}`}</VersionContainer>
        {children}
      </Box>
    );
  }
}

const VersionContainer = styled.pre`
  position: fixed;
  top: 8px;
  right: 8px;
  font-size: 8px;
  color: ${p => p.theme.colors.palette.text.shade60};
`;

const ErrContainer = styled.pre`
  margin: auto;
  max-width: 80vw;
  ${p => p.theme.overflow.xy};
  padding: 10px;
  border-radius: 2px;
  background-color: ${p => p.theme.colors.palette.background.paper};
  color: ${p => p.theme.colors.palette.text.shade80};
  font-size: 10px;
  font-family: monospace;
  cursor: text;
  user-select: text;
`;

export default withTranslation()(RenderError);

export const IconWrapperCircle: ThemedComponent<{}> = styled(Box)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #ea2e4919;
  align-items: center;
  justify-content: center;
`;
