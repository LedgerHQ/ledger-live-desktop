import React, { useCallback, useContext } from "react";
import { BigNumber } from "bignumber.js";
import map from "lodash/map";
import { Trans } from "react-i18next";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import type { TokenCurrency,  Transaction,  TransactionStatus } from "@ledgerhq/live-common/lib/types";
import type { ExchangeRate, Exchange } from "@ledgerhq/live-common/lib/exchange/swap/types";
import { WrongDeviceForAccount, UpdateYourApp } from "@ledgerhq/errors";
import { LatestFirmwareVersionRequired } from "@ledgerhq/live-common/lib/errors";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import {
  getAccountUnit,
  getMainAccount,
  getAccountName,
  getAccountCurrency,
} from "@ledgerhq/live-common/lib/account";
import { closeAllModal } from "~/renderer/actions/modals";
import Animation from "~/renderer/animations";
import TranslatedError from "~/renderer/components/TranslatedError";
import Box from "~/renderer/components/Box";
import BigSpinner from "~/renderer/components/BigSpinner";
import Alert from "~/renderer/components/Alert";
import ConnectTroubleshooting from "~/renderer/components/ConnectTroubleshooting";
import ExportLogsButton from "~/renderer/components/ExportLogsButton";
import { getDeviceAnimation } from "./animations";
import { DeviceBlocker } from "./DeviceBlocker";
import ErrorIcon from "~/renderer/components/ErrorIcon";
import IconTriangleWarning from "~/renderer/icons/TriangleWarning";
import SupportLinkError from "~/renderer/components/SupportLinkError";
import { urls } from "~/config/urls";
import CurrencyUnitValue from "~/renderer/components/CurrencyUnitValue";
import ExternalLinkButton from "../ExternalLinkButton";
import TrackPage, { setTrackingSource } from "~/renderer/analytics/TrackPage";
import { Rotating } from "~/renderer/components/Spinner";
import ProgressCircle from "~/renderer/components/ProgressCircle";
import CrossCircle from "~/renderer/icons/CrossCircle";
import { getProviderIcon } from "~/renderer/screens/exchange/Swap2/utils";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import { SWAP_VERSION } from "~/renderer/screens/exchange/Swap2/utils/index";
import { context } from "~/renderer/drawers/Provider";
import { Text, Button, Flex } from "@ledgerhq/react-ui";
import Link from "@ledgerhq/react-ui/components/cta/Link";

const AnimationWrapper = styled.div<{ modelId?: DeviceModelId }>`
  width: 600px;
  max-width: 100%;
  height: ${p => (p.modelId === "blue" ? 300 : 200)}px;
  padding-bottom: ${p => (p.modelId === "blue" ? 20 : 0)}px;
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProgressWrapper = styled.div`
  padding: 24px;
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled(Flex).attrs({
  flexDirection: "column",
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
})`
  min-height: 260px;
  max-width: 100%;
`;

const Logo = styled.div<{ warning?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${p => (p.warning ? p.theme.colors.warning : p.theme.colors.alertRed)};
  margin-bottom: 20px;
`;

export const Header = styled.div`
  display: flex;
  flex: 1 0 0%;
  flex-direction: column;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
`;

export const Footer = styled.div`
  display: flex;
  flex: 1 0 0%;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
`;

const Title = styled(Text).attrs(p => ({
  type: "h2",
  color: p.theme.colors.palette.neutral.c100,
  textAlign: "center",
}))`
  white-space: pre-line;
`;

const SubTitle = styled(Text).attrs(p => ({
  type: "h3",
  color: p.theme.colors.palette.neutral.c100,
  textAlign: "center",
}))`
  margin-top: 8px;
`;

const ErrorTitle = styled(Text).attrs(p => ({
  type: "h2",
  color: p.theme.colors.palette.neutral.c100,
  textAlign: "center",
}))`
  user-select: text;
  margin-bottom: 10px;
`;

const ErrorDescription = styled(Text).attrs(p => ({
  type: "body",
  color: p.theme.colors.palette.neutral.c60,
  textAlign: "center",
}))`
  user-select: text;
`;

const ButtonContainer = styled(Box).attrs(p => ({
  mt: 25,
  horizontal: true,
}))``;

const TroubleshootingWrapper = styled.div`
  margin-top: auto;
  margin-bottom: 16px;
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
  updateApp,
  firmwareUpdate,
}: {
  closeAllModal: () => void,
  appName?: string,
  updateApp?: boolean,
  firmwareUpdate?: boolean,
}) => {
  const history = useHistory();
  const { setDrawer } = useContext(context);

  const onClick = useCallback(() => {
    const urlParams = new URLSearchParams({
      updateApp: updateApp ? "true" : "false",
      firmwareUpdate: firmwareUpdate ? "true" : "false",
      ...(appName ? { q: appName } : {}),
    });
    const search = urlParams.toString();
    setTrackingSource("device action open manager button");
    history.push({
      pathname: "/manager",
      search: search ? `?${search}` : "",
    });
    closeAllModal();
    setDrawer(undefined);
  }, [updateApp, firmwareUpdate, appName, history, closeAllModal, setDrawer]);

  return (
    <div style={{ marginTop: "4px"}}>
      <Button type="main" onClick={onClick}>
        <Trans i18nKey="DeviceAction.openManager" />
      </Button>
    </div>
  );
};

const OpenManagerButton = connect(null, { closeAllModal })(OpenManagerBtn);

export const renderRequiresAppInstallation = ({ appNames }: { appNames: string[] }) => {
  const appNamesCSV = appNames.join(", ");
  return (
    <Wrapper>
      <Logo>
        <CrossCircle size={44} />
      </Logo>
      <ErrorTitle>
        <Trans i18nKey="DeviceAction.appNotInstalledTitle" count={appNames.length} />
      </ErrorTitle>
      <ErrorDescription>
        <Trans
          i18nKey="DeviceAction.appNotInstalled"
          values={{ appName: appNamesCSV }}
          count={appNames.length}
        />
      </ErrorDescription>
      <Box mt={24}>
        <OpenManagerButton appName={appNamesCSV} />
      </Box>
    </Wrapper>
  );
};

export const renderInstallingApp = ({
  appName,
  progress,
}: {
  appName: string,
  progress: number,
}) => {
  return (
    <Wrapper id="deviceAction-loading">
      <Header />
      <ProgressWrapper>
        {progress ? (
          <ProgressCircle size={58} progress={progress} />
        ) : (
          <Rotating size={58}>
            <ProgressCircle hideProgress size={58} progress={0.06} />
          </Rotating>
        )}
      </ProgressWrapper>
      <Footer>
        <Title>
          <Trans i18nKey="DeviceAction.installApp" values={{ appName }} />
        </Title>
        <SubTitle>
          <Trans i18nKey="DeviceAction.installAppDescription" />
        </SubTitle>
      </Footer>
    </Wrapper>
  );
};

export const renderListingApps = () => (
  <Wrapper id="deviceAction-loading">
    <Header />
    <ProgressWrapper>
      <Rotating size={58}>
        <ProgressCircle hideProgress size={58} progress={0.06} />
      </Rotating>
    </ProgressWrapper>
    <Footer>
      <Title>
        <Trans i18nKey="DeviceAction.listApps" />
      </Title>
      <SubTitle>
        <Trans i18nKey="DeviceAction.listAppsDescription" />
      </SubTitle>
    </Footer>
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
  tokenContext?: TokenCurrency,
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
      <Button type="shade" onClick={passWarning}>
        <Trans i18nKey="common.continue" />
      </Button>
      <OpenManagerButton appName={appName} updateApp />
    </ButtonContainer>
  </Wrapper>
);

export const renderError = ({
  error,
  withOpenManager,
  onRetry,
  withExportLogs,
  list,
  supportLink,
  warning,
  managerAppName,
  requireFirmwareUpdate,
}: {
  error: Error,
  withOpenManager?: boolean,
  onRetry?: () => void,
  withExportLogs?: boolean,
  list?: boolean,
  supportLink?: string,
  warning?: boolean,
  managerAppName?: string,
  requireFirmwareUpdate?: boolean,
}) => (
  <Wrapper id={`error-${error.name}`}>
    <Logo warning={warning}>
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
      {managerAppName || requireFirmwareUpdate ? (
        <OpenManagerButton
          appName={managerAppName}
          updateApp={error instanceof UpdateYourApp}
          firmwareUpdate={error instanceof LatestFirmwareVersionRequired}
        />
      ) : (
        <>
          {supportLink ? (
            <Link href={supportLink}><Trans i18nKey="common.getSupport" /></Link>
          ) : null}
          {withExportLogs ? (
            <ExportLogsButton
              title={<Trans i18nKey="settings.exportLogs.title" />}
              small={false}
              primary={false}
              outlineGrey
              mx={1}
            />
          ) : null}
          {onRetry ? (
            <div style={{ marginLeft: withExportLogs ? 4 : 0 }}>
              <Button type="main" onClick={onRetry}>
                <Trans i18nKey="common.retry" />
              </Button>
            </div>
          ) : null}
        </>
      )}
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
    // TODO: V3 - Remove this as soon as we add constructor to createCustomErrorClass from the erorr package
    error: new (WrongDeviceForAccount as unknown as any)(null, { accountName }),
    withExportLogs: true,
    onRetry,
  });

export const renderConnectYourDevice = ({
  modelId,
  type,
  onRetry,
  device,
  unresponsive,
}: {
  modelId: DeviceModelId,
  type: "light" | "dark",
  onRetry: () => void,
  device?: Device,
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
        <TroubleshootingWrapper>
          <ConnectTroubleshooting />
        </TroubleshootingWrapper>
      ) : null}
    </Footer>
  </Wrapper>
);

export const renderFirmwareUpdating = ({
  modelId,
  type,
}: {
  modelId: DeviceModelId,
  type: "light" | "dark",
}) => (
  <Wrapper>
    <Header />
    <AnimationWrapper modelId={modelId}>
      <Animation animation={getDeviceAnimation(modelId, type, "firmwareUpdating")} />
    </AnimationWrapper>
    <Footer>
      <Title>
        <Trans i18nKey={"DeviceAction.unlockDeviceAfterFirmwareUpdate"} />
      </Title>
    </Footer>
  </Wrapper>
);

export const renderSwapDeviceConfirmation = ({
  modelId,
  type,
  transaction,
  status,
  exchangeRate,
  exchange,
  amountExpectedTo,
  estimatedFees,
}: {
  modelId: DeviceModelId,
  type: "light" | "dark",
  transaction: Transaction,
  status: TransactionStatus,
  exchangeRate: ExchangeRate,
  exchange: Exchange,
  amountExpectedTo?: string,
  estimatedFees?: string,
}) => (
    <>
      <Alert type="primary" learnMoreUrl={urls.swap.learnMore} mb={3}>
        <Trans i18nKey="DeviceAction.swap.notice" />
      </Alert>
        {map(
          {
            amountSent: (
              <CurrencyUnitValue
                unit={getAccountUnit(exchange.fromAccount)}
                value={transaction.amount}
                showCode
              />
            ),
            fees: (
              <CurrencyUnitValue
                unit={getAccountUnit(
                  getMainAccount(exchange.fromAccount, exchange.fromParentAccount),
                )}
                value={new BigNumber(estimatedFees || 0)}
                showCode
              />
            ),
            amountReceived: (
              <CurrencyUnitValue
                unit={getAccountUnit(exchange.toAccount)}
                value={amountExpectedTo ? new BigNumber(amountExpectedTo) : exchangeRate.toAmount}
                showCode
              />
            ),
          },
          (value, key) => {
            return (
              <Box horizontal justifyContent="space-between" key={key} mb={2} ml="12px" mr="12px">
              <Text type="small" color="palette.neutral.c40">
                  <Trans i18nKey={`DeviceAction.swap.${key}`} />
                </Text>
                <Text type="small" color="palette.neutral.c80">
                  {value}
                </Text>
              </Box>
            );
          },
        )}
      {renderVerifyUnwrapped({ modelId, type })}
    </>
  );

export const renderSwapDeviceConfirmationV2 = ({
  modelId,
  type,
  transaction,
  status,
  exchangeRate,
  exchange,
  amountExpectedTo,
  estimatedFees,
}: {
  modelId: DeviceModelId,
  type: "light" | "dark",
  transaction: Transaction,
  status: TransactionStatus,
  exchangeRate: ExchangeRate,
  exchange: Exchange,
  amountExpectedTo?: string,
  estimatedFees?: string,
}) => {
  const ProviderIcon = getProviderIcon(exchangeRate);
  const [sourceAccountName, sourceAccountCurrency] = [
    getAccountName(exchange.fromAccount),
    getAccountCurrency(exchange.fromAccount),
  ];
  const [targetAccountName, targetAccountCurrency] = [
    getAccountName(exchange.toAccount),
    getAccountCurrency(exchange.toAccount),
  ];
  return (
    <>
      <TrackPage
        category="Swap"
        name="ModalStep-summary"
        sourcecurrency={sourceAccountCurrency?.name}
        targetcurrency={targetAccountCurrency?.name}
        provider={exchangeRate.provider}
        swapVersion={SWAP_VERSION}
      />
      <Box flex={0}>
        <Alert type="primary" learnMoreUrl={urls.swap.learnMore} mb={7} mx={4}>
          <Trans i18nKey="DeviceAction.swap.notice" />
        </Alert>
      </Box>
      <Box mx={6}>
        {map(
          {
            amountSent: (
                <CurrencyUnitValue
                  unit={getAccountUnit(exchange.fromAccount)}
                  value={transaction.amount}
                  showCode
                />
            ),
            amountReceived: (
              <CurrencyUnitValue
                unit={getAccountUnit(exchange.toAccount)}
                value={amountExpectedTo ? new BigNumber(amountExpectedTo) : exchangeRate.toAmount}
                showCode
              />
            ),
            provider: (
              <Box horizontal alignItems="center" style={{ gap: "6px" }}>
                <ProviderIcon size={18} />
                <Text textTransform="capitalize">{exchangeRate.provider}</Text>
              </Box>
            ),
            fees: (
              <CurrencyUnitValue
                unit={getAccountUnit(
                  getMainAccount(exchange.fromAccount, exchange.fromParentAccount),
                )}
                value={new BigNumber(estimatedFees || 0)}
                showCode
              />
            ),
            sourceAccount: (
              <Box horizontal alignItems="center" style={{ gap: "6px" }}>
                {sourceAccountCurrency && (
                  <CryptoCurrencyIcon circle currency={sourceAccountCurrency} size={18} />
                )}
                <Text textTransform="capitalize">{sourceAccountName}</Text>
              </Box>
            ),
            targetAccount: (
              <Box horizontal alignItems="center" style={{ gap: "6px" }}>
                {targetAccountCurrency && (
                  <CryptoCurrencyIcon circle currency={targetAccountCurrency} size={18} />
                )}
                <Text textTransform="capitalize">{targetAccountName}</Text>
              </Box>
            ),
          },
          (value, key) => {
            return (
              <Box horizontal justifyContent="space-between" key={key} mb={4}>
                <Text type="body" color="palette.neutral.c40">
                  <Trans i18nKey={`DeviceAction.swap2.${key}`} />
                </Text>
                <Text type="body" color="palette.neutral.c100">
                  {value}
                </Text>
              </Box>
            );
          },
        )}
      </Box>
      {renderVerifyUnwrapped({ modelId, type })}
    </>
  );
};

export const renderSellDeviceConfirmation = ({
  modelId,
  type,
}: {
  modelId: DeviceModelId,
  type: "light" | "dark",
}) => (
  <>
    <Alert type="primary" learnMoreUrl={urls.swap.learnMore} horizontal={false}>
      <Trans i18nKey="DeviceAction.sell.notice" />
    </Alert>
    {renderVerifyUnwrapped({ modelId, type })}
    <Box alignItems={"center"}>
      <Text textAlign="center" type="body">
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
  children?: React.ReactNode,
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
     <div style={{ marginTop: "4px" }}>
        <Button type="main" onClick={onAutoRepair}>
          <Trans i18nKey="common.continue" />
        </Button>
      </div>
  </Wrapper>
);
