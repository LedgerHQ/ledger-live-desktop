// @flow
import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import type { TokenCurrency } from "@ledgerhq/live-common/lib/types";
import { WrongDeviceForAccount } from "@ledgerhq/errors";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import { closeAllModal } from "~/renderer/actions/modals";
import Animation from "~/renderer/animations";
import Button from "~/renderer/components/Button";
import TranslatedError from "~/renderer/components/TranslatedError";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import BigSpinner from "~/renderer/components/BigSpinner";
import InfoBox from "~/renderer/components/InfoBox";
import ConnectTroubleshooting from "~/renderer/components/ConnectTroubleshooting";
import ExportLogsButton from "~/renderer/components/ExportLogsButton";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { getDeviceAnimation } from "./animations";
import { DeviceBlocker } from "./DeviceBlocker";
import ErrorIcon from "~/renderer/components/ErrorIcon";
import IconTriangleWarning from "~/renderer/icons/TriangleWarning";
import SupportLinkError from "~/renderer/components/SupportLinkError";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";

const AnimationWrapper: ThemedComponent<{ modelId: DeviceModelId }> = styled.div`
  width: 600px;
  max-width: 100%;
  height: ${p => (p.modelId === "blue" ? 300 : 200)}px;
  padding-bottom: ${p => (p.modelId === "blue" ? 20 : 0)}px;
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  max-width: 100%;
`;

const Logo: ThemedComponent<{ warning?: boolean }> = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${p => (p.warning ? p.theme.colors.warning : p.theme.colors.alertRed)};
  margin-bottom: 20px;
`;

const Header = styled.div`
  display: flex;
  flex: 1 0 0%;
  flex-direction: column;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
`;

const Footer = styled.div`
  display: flex;
  flex: 1 0 0%;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
`;

const Title = styled(Text).attrs({
  ff: "Inter|SemiBold",
  color: "palette.text.shade100",
  textAlign: "center",
  fontSize: 5,
})`
  white-space: pre-line;
`;

const ErrorTitle = styled(Text).attrs({
  ff: "Inter|SemiBold",
  color: "palette.text.shade100",
  textAlign: "center",
  fontSize: 6,
})`
  user-select: text;
  margin-bottom: 10px;
`;

const ErrorDescription = styled(Text).attrs({
  ff: "Inter|Regular",
  color: "palette.text.shade60",
  textAlign: "center",
  fontSize: 4,
})`
  user-select: text;
`;

const ButtonContainer = styled(Box).attrs(p => ({
  mt: 25,
  horizontal: true,
}))``;

const TroobleshootingWrapper = styled.div`
  margin-top: auto;
`;

// these are not components because we want reconciliation to not remount the sub elements

export const renderRequestQuitApp = ({
  modelId,
  type,
}: {
  modelId: DeviceModelId,
  type: "light" | "dark",
}) => (
  <Wrapper>
    <Header />
    <AnimationWrapper modelId={modelId}>
      <Animation animation={getDeviceAnimation(modelId, type, "quitApp")} />
    </AnimationWrapper>
    <Footer>
      <Title>
        <Trans i18nKey="DeviceAction.quitApp" />
      </Title>
    </Footer>
  </Wrapper>
);

export const renderVerifyUnwrapped = ({
  modelId,
  type,
}: {
  modelId: DeviceModelId,
  type: "light" | "dark",
}) => (
  <AnimationWrapper modelId={modelId}>
    <DeviceBlocker />
    <Animation animation={getDeviceAnimation(modelId, type, "validate")} />
  </AnimationWrapper>
);

const OpenManagerBtn = ({
  closeAllModal,
  appName,
  mt = 2,
}: {
  closeAllModal: () => void,
  appName?: string,
  mt?: number,
}) => {
  const history = useHistory();
  const onClick = useCallback(() => {
    history.push({
      pathname: "manager",
      search: appName ? `?q=${appName}` : "",
      state: { source: "device action open manager button" },
    });
    closeAllModal();
  }, [history, appName, closeAllModal]);
  return (
    <Button mt={mt} primary onClick={onClick}>
      <Trans i18nKey="DeviceAction.openManager" />
    </Button>
  );
};

const OpenManagerButton = connect(null, { closeAllModal })(OpenManagerBtn);

export const renderRequiresAppInstallation = ({ appName }: { appName: string }) => (
  <Wrapper>
    <Title>
      <Trans i18nKey="DeviceAction.appNotInstalled" values={{ appName }} />
    </Title>
    <OpenManagerButton appName={appName} />
  </Wrapper>
);

export const renderAllowManager = ({
  modelId,
  type,
  wording,
}: {
  modelId: DeviceModelId,
  type: "light" | "dark",
  wording: string,
}) => (
  <Wrapper>
    <DeviceBlocker />
    <Header />
    <AnimationWrapper modelId={modelId}>
      <Animation animation={getDeviceAnimation(modelId, type, "allowManager")} />
    </AnimationWrapper>
    <Footer>
      <Title>
        <Trans i18nKey="DeviceAction.allowManagerPermission" values={{ wording }} />
      </Title>
    </Footer>
  </Wrapper>
);

export const renderAllowOpeningApp = ({
  modelId,
  type,
  wording,
  tokenContext,
  isDeviceBlocker,
}: {
  modelId: DeviceModelId,
  type: "light" | "dark",
  wording: string,
  tokenContext?: ?TokenCurrency,
  isDeviceBlocker?: boolean,
}) => (
  <Wrapper>
    {isDeviceBlocker ? <DeviceBlocker /> : null}
    <Header />
    <AnimationWrapper modelId={modelId}>
      <Animation animation={getDeviceAnimation(modelId, type, "openApp")} />
    </AnimationWrapper>
    <Footer>
      <Title>
        <Trans i18nKey="DeviceAction.allowAppPermission" values={{ wording }} />
        {!tokenContext ? null : (
          <>
            {"\n"}
            <Trans
              i18nKey="DeviceAction.allowAppPermissionSubtitleToken"
              values={{ token: tokenContext.name }}
            />
          </>
        )}
      </Title>
    </Footer>
  </Wrapper>
);

export const renderWarningOutdated = ({
  passWarning,
  appName,
}: {
  passWarning: () => void,
  appName: string,
}) => (
  <Wrapper id={`warning-outdated-app`}>
    <Logo warning>
      <IconTriangleWarning size={44} />
    </Logo>
    <ErrorTitle>
      <Trans i18nKey="DeviceAction.outdated" />
    </ErrorTitle>
    <ErrorDescription>
      <Trans i18nKey="DeviceAction.outdatedDesc" values={{ appName }} />
    </ErrorDescription>
    <ButtonContainer>
      <Button secondary onClick={passWarning}>
        <Trans i18nKey="common.continue" />
      </Button>
      <OpenManagerButton ml={4} mt={0} appName={appName} />
    </ButtonContainer>
  </Wrapper>
);

export const renderError = ({
  error,
  onRetry,
  withExportLogs,
  list,
}: {
  error: Error,
  onRetry?: () => void,
  withExportLogs?: boolean,
  list?: boolean,
}) => (
  <Wrapper id={`error-${error.name}`}>
    <Logo>
      <ErrorIcon size={44} error={error} />
    </Logo>
    <ErrorTitle>
      <TranslatedError error={error} />
    </ErrorTitle>
    <ErrorDescription>
      <TranslatedError error={error} field="description" /> <SupportLinkError error={error} />
    </ErrorDescription>
    {list ? (
      <ErrorDescription>
        <ol style={{ textAlign: "justify" }}>
          <TranslatedError error={error} field="list" />
        </ol>
      </ErrorDescription>
    ) : null}
    <ButtonContainer>
      {withExportLogs ? (
        <ExportLogsButton
          title={<Trans i18nKey="settings.exportLogs.title" />}
          small={false}
          primary={false}
          outlineGrey
        />
      ) : null}
      {onRetry ? (
        <Button primary ml={withExportLogs ? 4 : 0} onClick={onRetry}>
          <Trans i18nKey="common.retry" />
        </Button>
      ) : null}
    </ButtonContainer>
  </Wrapper>
);

export const renderInWrongAppForAccount = ({
  onRetry,
  accountName,
}: {
  onRetry: () => void,
  accountName: string,
}) =>
  renderError({
    error: new WrongDeviceForAccount(null, { accountName }),
    withExportLogs: true,
    onRetry,
  });

export const renderConnectYourDevice = ({
  modelId,
  type,
  onRetry,
  onRepairModal,
  device,
  unresponsive,
}: {
  modelId: DeviceModelId,
  type: "light" | "dark",
  onRetry: () => void,
  onRepairModal: () => void,
  device: ?Device,
  unresponsive?: boolean,
}) => (
  <Wrapper>
    <Header />
    <AnimationWrapper modelId={modelId}>
      <Animation
        animation={getDeviceAnimation(
          modelId,
          type,
          unresponsive ? "enterPinCode" : "plugAndPinCode",
        )}
      />
    </AnimationWrapper>
    <Footer>
      <Title>
        <Trans
          i18nKey={
            unresponsive ? "DeviceAction.unlockDevice" : "DeviceAction.connectAndUnlockDevice"
          }
        />
      </Title>
      {!device ? (
        <TroobleshootingWrapper>
          <ConnectTroubleshooting onRepair={onRepairModal} />
        </TroobleshootingWrapper>
      ) : null}
    </Footer>
  </Wrapper>
);

export const renderSwapDeviceConfirmation = ({
  modelId,
  type,
}: {
  modelId: DeviceModelId,
  type: "light" | "dark",
}) => (
  <>
    <InfoBox onLearnMore={() => openURL(urls.swap.learnMore)} horizontal={false}>
      <Trans i18nKey="DeviceAction.swap.notice" />
    </InfoBox>
    {renderVerifyUnwrapped({ modelId, type })}
    <Box id="swap-modal-device-confirm" alignItems={"center"}>
      <Text textAlign="center" ff="Inter|SemiBold" color="palette.text.shade100" fontSize={5}>
        <Trans i18nKey="DeviceAction.swap.confirm" />
      </Text>
    </Box>
  </>
);

export const renderSellDeviceConfirmation = ({
  modelId,
  type,
}: {
  modelId: DeviceModelId,
  type: "light" | "dark",
}) => (
  <>
    <InfoBox onLearnMore={() => openURL(urls.swap.learnMore)} horizontal={false}>
      <Trans i18nKey="DeviceAction.sell.notice" />
    </InfoBox>
    {renderVerifyUnwrapped({ modelId, type })}
    <Box alignItems={"center"}>
      <Text textAlign="center" ff="Inter|SemiBold" color="palette.text.shade100" fontSize={5}>
        <Trans i18nKey="DeviceAction.sell.confirm" />
      </Text>
    </Box>
  </>
);

export const renderLoading = ({
  modelId,
  children,
}: {
  modelId: DeviceModelId,
  children?: React$Node,
}) => (
  <Wrapper id="deviceAction-loading">
    <Header />
    <AnimationWrapper modelId={modelId}>
      <BigSpinner size={50} />
    </AnimationWrapper>
    <Footer>
      <Title>{children || <Trans i18nKey="DeviceAction.loading" />}</Title>
    </Footer>
  </Wrapper>
);

export const renderBootloaderStep = ({ onAutoRepair }: { onAutoRepair: () => void }) => (
  <Wrapper>
    <Title>
      <Trans i18nKey="genuinecheck.deviceInBootloader">
        {"placeholder"}
        <b>{"placeholder"}</b>
        {"placeholder"}
      </Trans>
    </Title>
    <Button mt={2} primary onClick={onAutoRepair}>
      <Trans i18nKey="common.continue" />
    </Button>
  </Wrapper>
);
