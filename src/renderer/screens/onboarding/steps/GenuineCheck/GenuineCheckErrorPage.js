// @flow

import React, { PureComponent, Fragment } from "react";
import { Trans } from "react-i18next";
import { getDeviceModel } from "@ledgerhq/devices";

import { urls } from "~/config/urls";
import LedgerBlue from "~/renderer/images/ledger-blue-error-onb.svg";
import LedgerNanoS from "~/renderer/images/ledger-nano-s-error-onb.svg";
import LedgerNanoX from "~/renderer/images/ledger-nano-x-error-onb.svg";
import type { OnboardingState } from "~/renderer/reducers/onboarding";
import InvertableImg from "~/renderer/components/InvertableImg";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import ExternalLinkButton from "~/renderer/components/ExternalLinkButton";
import TrackPage from "~/renderer/analytics/TrackPage";

import { Title, Description, OnboardingFooterWrapper } from "../../sharedComponents";

const Img = ({ type }: { type: string }) => {
  switch (type) {
    case "blue":
      return <InvertableImg alt="" src={LedgerBlue} />;
    case "nanoX":
      return <InvertableImg alt="" src={LedgerNanoX} />;
    default:
      return <InvertableImg alt="" src={LedgerNanoS} />;
  }
};

type Props = {
  pin: boolean,
  redoGenuineCheck: () => void,
  onboarding: OnboardingState,
};

class GenuineCheckErrorPage extends PureComponent<Props, *> {
  trackErrorPage = (page: string) => {
    const { onboarding } = this.props;

    const model = getDeviceModel(onboarding.deviceModelId || "nanoS");

    return (
      <TrackPage
        category="Onboarding"
        name={`Genuine Check Error Page - ${page}`}
        flowType={onboarding.flowType}
        deviceType={model.productName}
      />
    );
  };

  renderErrorPage = () => {
    const { onboarding, pin } = this.props;
    return (
      <Fragment>
        {!pin ? (
          <Fragment>
            {this.trackErrorPage("PIN Step")}
            <Title>
              <Trans i18nKey="onboarding.genuineCheck.errorPage.title.pinFailed" />
            </Title>
            <Description>
              {<Trans i18nKey="onboarding.genuineCheck.errorPage.desc.pinFailed" />}
            </Description>
          </Fragment>
        ) : (
          <Fragment>
            {this.trackErrorPage("Recovery Phase Step")}
            <Title>
              {<Trans i18nKey="onboarding.genuineCheck.errorPage.title.recoveryPhraseFailed" />}
            </Title>
            <Description>
              {<Trans i18nKey="onboarding.genuineCheck.errorPage.desc.recoveryPhraseFailed" />}
            </Description>
          </Fragment>
        )}
        <Box mt={5} mr={onboarding.deviceModelId === "blue" ? 0 : 7}>
          <Img type={onboarding.deviceModelId || "nanoS"} />
        </Box>
      </Fragment>
    );
  };

  render() {
    const { redoGenuineCheck } = this.props;
    return (
      <Box sticky pt={50}>
        <Box grow alignItems="center" justifyContent="center">
          {this.renderErrorPage()}
        </Box>
        <OnboardingFooterWrapper>
          <Button outlineGrey onClick={() => redoGenuineCheck()}>
            <Trans i18nKey="common.back" />
          </Button>
          <ExternalLinkButton
            danger
            ml="auto"
            label={<Trans i18nKey="onboarding.genuineCheck.buttons.contactSupport" />}
            url={urls.contactSupport}
          />
        </OnboardingFooterWrapper>
      </Box>
    );
  }
}

export default GenuineCheckErrorPage;
