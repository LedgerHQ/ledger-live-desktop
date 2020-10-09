// @flow
import React, { useCallback, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import styled from "styled-components";

import { useDispatch } from "react-redux";

import type {
  Account,
  AccountLike,
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";

import LendingTermsIllu from "~/renderer/images/lending-terms.svg";
import LendingTermsIllu1 from "~/renderer/images/lending-illu-1.svg";
import LendingTermsIllu2 from "~/renderer/images/lending-illu-2.svg";
import LendingTermsIllu3 from "~/renderer/images/lending-illu-3.svg";
import LendingInfoIllu1 from "~/renderer/images/lending-info-1.svg";
import LendingInfoIllu2 from "~/renderer/images/lending-info-2.svg";
import LendingInfoIllu3 from "~/renderer/images/lending-info-3.svg";

import { closeModal, openModal } from "~/renderer/actions/modals";
import { openURL } from "~/renderer/linking";

import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import CheckBox from "~/renderer/components/CheckBox";
import { FakeLink } from "~/renderer/components/Link";
import { isAcceptedLendingTerms, acceptLendingTerms } from "~/renderer/terms";
import TutorialModal from "~/renderer/modals/TutorialModal";

type Props = {
  name?: string,
  account: AccountLike,
  parentAccount: ?Account,
  currency: CryptoCurrency | TokenCurrency,
  ...
};

export default function LendTermsModal({ name, account, parentAccount, currency, ...rest }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isAcceptedTerms = isAcceptedLendingTerms();
  const { t } = useTranslation();

  const [accepted, setAccepted] = useState(isAcceptedTerms);
  const onSwitchAccept = useCallback(() => setAccepted(!accepted), [accepted]);

  const onClose = useCallback(() => {
    dispatch(closeModal(name));
  }, [name, dispatch]);

  const acceptTerms = useCallback(() => {
    acceptLendingTerms();
  }, []);

  const onFinish = useCallback(() => {
    onClose();
    dispatch(
      openModal("MODAL_LEND_SELECT_ACCOUNT", {
        ...rest,
        currency,
        nextStep: "MODAL_LEND_ENABLE_FLOW",
        cta: t("lend.enable.steps.selectAccount.cta"),
      }),
    );
  }, [onClose, dispatch, rest, currency, t]);

  const onTermsLinkClick = useCallback(() => {
    // @TODO replace this URL with the correct one
    openURL("https://ledger.com");
  }, []);

  return (
    <TutorialModal
      {...rest}
      name={name}
      account={account}
      parentAccount={parentAccount}
      category="Lending Flow"
      trackName="Step Terms and Conditions"
      steps={[
        ...(isAcceptedTerms
          ? []
          : [
              {
                illustration: (
                  <>
                    <LendingTermsImg />
                    <LendingTermsImg1 />
                    <LendingTermsImg2 />
                    <LendingTermsImg3 />
                  </>
                ),
                title: <Trans i18nKey="lend.info.terms.title" />,
                subtitle: <Trans i18nKey="lend.info.terms.subtitle" />,
                description: <Trans i18nKey="lend.info.terms.description" />,
                onFinish: acceptTerms,
                footer: (
                  <Box flex="2" horizontal alignItems="center">
                    <CheckBox
                      isChecked={accepted}
                      onChange={onSwitchAccept}
                      id="modal-terms-checkbox"
                    />
                    <Text ff="Inter|SemiBold" fontSize={4} style={{ marginLeft: 8, flex: 1 }}>
                      <Trans i18nKey="lend.info.terms.switchLabel">
                        <FakeLink onClick={onTermsLinkClick}></FakeLink>
                      </Trans>
                    </Text>
                  </Box>
                ),
                continueDisabled: !accepted,
              },
            ]),
        {
          illustration: (
            <>
              <LendingTermsImg overlay />
              <LendingTermsImg1 />
              <LendingTermsImg2 />
              <LendingTermsImg3 />
              <LendingInfoImg1 />
            </>
          ),
          title: (
            <Trans i18nKey="lend.info.steps.title" values={{ step: 1, total: 3 }}>
              <TitleSpacer />
            </Trans>
          ),
          subtitle: <Trans i18nKey="lend.info.steps.1.subtitle" />,
          description: <Trans i18nKey="lend.info.steps.1.description" />,
          previousDisabled: true,
        },
        {
          illustration: (
            <>
              <LendingTermsImg overlay />
              <LendingTermsImg1 />
              <LendingTermsImg2 />
              <LendingTermsImg3 />
              <LendingInfoImg2 />
            </>
          ),
          title: (
            <Trans i18nKey="lend.info.steps.title" values={{ step: 2, total: 3 }}>
              <TitleSpacer />
            </Trans>
          ),
          subtitle: <Trans i18nKey="lend.info.steps.2.subtitle" />,
          description: <Trans i18nKey="lend.info.steps.2.description" />,
        },
        {
          illustration: (
            <>
              <LendingTermsImg overlay />
              <LendingTermsImg1 />
              <LendingTermsImg2 />
              <LendingTermsImg3 />
              <LendingInfoImg3 />
            </>
          ),
          title: (
            <Trans i18nKey="lend.info.steps.title" values={{ step: 3, total: 3 }}>
              <TitleSpacer />
            </Trans>
          ),
          subtitle: <Trans i18nKey="lend.info.steps.3.subtitle" />,
          description: <Trans i18nKey="lend.info.steps.3.description" />,
          onFinish,
        },
      ]}
    />
  );
}

const LendingTermsImg = styled.img.attrs(() => ({ src: LendingTermsIllu }))`
  width: 315px;
  height: auto;
  ${p => (p.overlay ? `filter: brightness(0.8) grayscale(0.2);` : "")}
`;

const LendingTermsImg1 = styled.img.attrs(() => ({ src: LendingTermsIllu1 }))`
  width: 60px;
  height: auto;
  position: absolute;
  top: 50px;
  left: 60px;
  animation: ${p => p.theme.animations.fadeInUp};
  opacity: 0;
  transform: translateY(66%);
  animation-delay: 0.5s;
  animation-duration: 0.9s;
`;

const LendingTermsImg2 = styled.img.attrs(() => ({ src: LendingTermsIllu2 }))`
  width: 55px;
  height: auto;
  position: absolute;
  top: -5px;
  left: 50%;
  animation: ${p => p.theme.animations.fadeInUp};
  opacity: 0;
  transform: translateY(66%);
  animation-delay: 0.4s;
  animation-duration: 1s;
`;

const LendingTermsImg3 = styled.img.attrs(() => ({ src: LendingTermsIllu3 }))`
  width: 45px;
  height: auto;
  position: absolute;
  top: 100px;
  right: 75px;
  animation: ${p => p.theme.animations.fadeInUp};
  opacity: 0;
  transform: translateY(66%);
  animation-delay: 0.6s;
  animation-duration: 0.8s;
`;

const LendingInfoImg1 = styled.img.attrs(() => ({ src: LendingInfoIllu1 }))`
  width: 170px;
  height: auto;
  position: absolute;
  top: 40px;
  left: 50%;
  animation: ${p => p.theme.animations.fadeIn};
  opacity: 0;
  transform: translateX(-50%);
  animation-delay: 0.2s;
  animation-duration: 0.4s;
`;

const LendingInfoImg2 = styled.img.attrs(() => ({ src: LendingInfoIllu2 }))`
  width: 170px;
  height: auto;
  position: absolute;
  top: 40px;
  left: 50%;
  animation: ${p => p.theme.animations.fadeIn};
  opacity: 0;
  transform: translateX(-50%);
  animation-delay: 0.2s;
  animation-duration: 0.4s;
`;

const LendingInfoImg3 = styled.img.attrs(() => ({ src: LendingInfoIllu3 }))`
  width: 170px;
  height: auto;
  position: absolute;
  top: 40px;
  left: 50%;
  animation: ${p => p.theme.animations.fadeIn};
  opacity: 0;
  transform: translateX(-50%);
  animation-delay: 0.2s;
  animation-duration: 0.4s;
`;

const TitleSpacer = styled.span`
  margin-left: 5px;
`;
