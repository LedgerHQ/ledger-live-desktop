import React, { useState, useCallback, useEffect, useContext } from "react";
import { FlowStepper, InvertTheme } from "@ledgerhq/react-ui";
import { Trans, useTranslation } from "react-i18next";
import { Account, AccountLike, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import logger from "~/logger/logger";
import { useSelector } from "react-redux";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { accountsSelector } from "~/renderer/reducers/accounts";
import { context } from "../Provider";
import { StepWarning, StepWarningFooter } from "./StepWarning";
import { StepAccount, StepAccountFooter } from "./StepAccount";
import { StepConnectDevice, StepConnectDeviceFooter } from "./StepConnectDevice";
import { StepVerifyAddress } from "./StepVerifyAddress";
import { FinalStepShareAddress } from "./FinalStepShareAddress";
import { FinalStepVerificationError } from "./FinalStepVerificationError";
import { useTheme } from "styled-components";

type Props = React.PropsWithChildren<{
  account?: Account;
  parentAccount?: Account;
  startWithWarning?: boolean;
  receiveTokenMode?: boolean;
  eventType?: string;
}>;

export const initialOptions = {
  big: true,
  hideNavigation: false,
  onBack: undefined,
  title: <Trans i18nKey="v3.receive.title" />,
};

const finalStepOptions = {
  title: undefined,
  extraContainerProps: { p: 0 },
  extraHeaderProps: { position: "absolute" as "absolute" | "relative", width: "100%", zIndex: 1 },
  extraFooterDividerProps: {
    variant: "default" as "default" | "light",
  },
  useLightTheme: true,
};

const stepOptions = (step: number, navigateTo: (step: number) => void) => ({
  ...initialOptions,
  onBack:
    step !== 1
      ? undefined
      : () => {
          navigateTo(0);
        },
});

export function ReceiveDrawer(props: Props) {
  const { t } = useTranslation();
  const { setDrawer } = useContext(context);
  const accounts = useSelector(accountsSelector);
  const device = useSelector(getCurrentDevice);
  const [account, setAccount] = useState<AccountLike | undefined>(
    () => props.account || accounts[0],
  );
  const [parentAccount, setParentAccount] = useState(() => props.parentAccount);
  const [isAddressVerified, setAddressVerified] = useState<boolean | undefined>();
  const [verifyAddressError, setVerifyAddressError] = useState<Error | null | undefined>(null);
  const [token, setToken] = useState<TokenCurrency>();
  const currency = account && getAccountCurrency(account);
  const currencyName = currency ? currency.name : undefined;

  const [activeIndex, setActiveIndex] = useState(props.startWithWarning ? -1 : 0);

  const navigateTo = (step: number) => {
    const drawerOptions = stepOptions(step, navigateTo);
    setDrawer(ReceiveDrawer, null, drawerOptions);
    setActiveIndex(step);
  };

  const handleRetry = () => {
    setAddressVerified(undefined);
    setVerifyAddressError(undefined);
    navigateTo(1);
  };

  const handleCloseDrawer = () => {
    setDrawer();
  };

  const handleChangeAddressVerified = (isAddressVerified?: boolean, err?: Error) => {
    if (err && err.name !== "UserRefusedAddress") {
      logger.critical(err);
    }
    setAddressVerified(isAddressVerified);
    setVerifyAddressError(err);
    if (typeof isAddressVerified === "boolean" && !err) {
      setDrawer(ReceiveDrawer, null, {
        ...initialOptions,
        ...finalStepOptions,
        extraFooterProps: {
          justifyContent: "flex-end",
          bg: "success.c100",
          columnGap: "16px",
        },
        footer: isAddressVerified ? (
          <FinalStepShareAddress.VerifiedFooter
            onDone={handleCloseDrawer}
            onReverify={handleRetry}
          />
        ) : (
          <FinalStepShareAddress.UnverifiedFooter
            onCancel={handleCloseDrawer}
            onVerify={handleRetry}
          />
        ),
      });
    }
    if (err) {
      setDrawer(ReceiveDrawer, null, {
        ...initialOptions,
        ...finalStepOptions,
        extraFooterProps: {
          justifyContent: "flex-end",
          bg: "error.c100",
          columnGap: "16px",
        },
        footer: (
          <FinalStepVerificationError.Footer onCancel={handleCloseDrawer} onRetry={handleRetry} />
        ),
      });
    }
  };

  const handleChangeAccount = useCallback(
    (account?: AccountLike | null, parentAccount?: Account | null) => {
      setAccount(account ?? undefined);
      setParentAccount(parentAccount ?? undefined);
    },
    [],
  );

  const handleSkipConfirm = () => {
    handleChangeAddressVerified(false);
  };

  useEffect(() => {
    if (!account) {
      if (props.account) {
        handleChangeAccount(props.account, props.parentAccount);
      } else {
        handleChangeAccount(accounts[0]);
      }
    }
  }, [accounts, account, props.account, props.parentAccount, handleChangeAccount]);

  if (verifyAddressError) {
    return <FinalStepVerificationError error={verifyAddressError} />;
  }
  if (typeof isAddressVerified === "boolean") {
    return (
      <FinalStepShareAddress
        account={account}
        parentAccount={parentAccount}
        isAddressVerified={isAddressVerified}
      />
    );
  }

  return (
    <FlowStepper
      activeIndex={activeIndex}
      extraContainerProps={{ width: "100%" }}
      extraStepperProps={{
        flex: 0.7,
        errored: !!verifyAddressError,
      }}
      extraStepperContainerProps={{ my: 12 }}
      footer={({ activeIndex }) =>
        activeIndex === -1 ? (
          <StepWarningFooter
            account={account}
            parentAccount={parentAccount}
            onContinue={() => navigateTo(0)}
          />
        ) : activeIndex === 0 ? (
          <StepAccountFooter
            token={token}
            account={account}
            parentAccount={parentAccount}
            onContinue={() => navigateTo(1)}
            receiveTokenMode={props.receiveTokenMode}
          />
        ) : activeIndex === 1 ? (
          <StepConnectDeviceFooter
            onSkipConfirm={handleSkipConfirm}
            eventType={props.eventType}
            currencyName={currencyName}
          />
        ) : null
      }
    >
      <FlowStepper.Step label={t("v3.receive.steps.chooseAccount.title")}>
        <StepAccount
          token={token}
          account={account}
          parentAccount={parentAccount}
          receiveTokenMode={props.receiveTokenMode}
          onChangeAccount={handleChangeAccount}
          onChangeToken={t => setToken(t as TokenCurrency)}
          eventType={props.eventType}
        />
      </FlowStepper.Step>
      <FlowStepper.Step label={t("v3.receive.steps.connectDevice.title")}>
        <StepConnectDevice
          account={account}
          parentAccount={parentAccount}
          token={token}
          onResult={() => navigateTo(2)}
        />
      </FlowStepper.Step>
      <FlowStepper.Step label={t("v3.receive.steps.receiveFunds.title")}>
        <StepVerifyAddress
          account={account}
          parentAccount={parentAccount}
          currencyName={currencyName}
          eventType={props.eventType}
          device={device}
          onChangeAddressVerified={handleChangeAddressVerified}
        />
      </FlowStepper.Step>
      <FlowStepper.Step label="" index={-1} hidden>
        <StepWarning
          account={account}
          parentAccount={parentAccount}
          onContinue={() => navigateTo(0)}
        />
      </FlowStepper.Step>
    </FlowStepper>
  );
}
ReceiveDrawer.initialOptions = initialOptions;
