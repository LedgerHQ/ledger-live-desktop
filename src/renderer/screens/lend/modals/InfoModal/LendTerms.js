// @flow
import React, { useCallback, useState } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";

import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";

import LendingTermsIllu from "~/renderer/images/lending-terms.svg";
import LendingTermsIllu1 from "~/renderer/images/lending-illu-1.svg";
import LendingTermsIllu2 from "~/renderer/images/lending-illu-2.svg";
import LendingTermsIllu3 from "~/renderer/images/lending-illu-3.svg";
import { openModal, closeModal } from "~/renderer/actions/modals";
import EarnRewardsInfoModal from "~/renderer/components/EarnRewardsInfoModal";
import WarnBox from "~/renderer/components/WarnBox";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";

import Check from "~/renderer/icons/CheckFull";
import TrackPage from "~/renderer/analytics/TrackPage";
import Rewards from "~/renderer/images/rewards.svg";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import useTheme from "~/renderer/hooks/useTheme";
import CheckBox from "~/renderer/components/CheckBox";
import { FakeLink } from "~/renderer/components/Link";
import { acceptLendingTerms } from "~/renderer/terms";

type Props = {
  name?: string,
  account: AccountLike,
  parentAccount: ?Account,
  ...
};

export default function LendTermsModal({ name, account, parentAccount, ...rest }: Props) {
  const dispatch = useDispatch();
  const bgColor = useTheme("colors.lightFog");

  const [accepted, setAccepted] = useState(false);
  const onSwitchAccept = useCallback(() => setAccepted(!accepted), [accepted]);

  const onClose = useCallback(() => {
    dispatch(closeModal(name));
  }, [name]);

  const onNext = useCallback(() => {
    acceptLendingTerms();
    onClose();
    // @TODO redirect to correct flow after accepting the terms
  }, []);
  const onTermsLinkClick = useCallback(() => {
    // @TODO replace this URL with the correct one
    openURL("https://ledger.com");
  }, []);
  return (
    <Modal
      {...rest}
      name={name}
      centered
      render={({ onClose, data }) => (
        <ModalBody
          title={null}
          headerStyle={{ backgroundColor: bgColor, padding: 0 }}
          onClose={onClose}
          noScroll
          render={onClose => (
            <Box flow={4}>
              <TrackPage category="Lending Flow" name="Step Terms and Conditions" />
              <IllustrationSection>
                <IllustrationContainer>
                  <LendingTermsImg />
                  <LendingTermsImg1 />
                  <LendingTermsImg2 />
                  <LendingTermsImg3 />
                </IllustrationContainer>
              </IllustrationSection>
              <Box flow={1} alignItems="center" px={6} mt={6}>
                <Box py={1} px={2} borderRadius={4} bg="blueTransparentBackground">
                  <BadgeLabel>
                    <Trans i18nKey="lend.info.terms.title" />
                  </BadgeLabel>
                </Box>

                <Text ff="Inter|SemiBold" fontSize={4} textAlign="center">
                  <Trans i18nKey="lend.info.terms.subtitle" />
                </Text>
                <Text ff="Inter|Regular" fontSize={3} textAlign="center">
                  <Trans i18nKey="lend.info.terms.description" />
                </Text>
              </Box>
            </Box>
          )}
          renderFooter={() => (
            <Box horizontal flex="1 1 0%">
              <Box flex="1" pr={8} horizontal alignItems="center">
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
              <Button primary disabled={!accepted} onClick={onNext}>
                <Trans i18nKey="common.continue" />
              </Button>
            </Box>
          )}
        />
      )}
    />
  );
}

const IllustrationSection = styled.div`
  width: 100%;
  height: 150px;
  position: relative;
  overflow: visible;
`;

const IllustrationContainer = styled.div`
  position: absolute;
  width: calc(100% + ${p => p.theme.space[6]}px);
  height: calc(100% + ${p => p.theme.space[6]}px);
  top: -${p => p.theme.space[4]}px;
  left: -${p => p.theme.space[4]}px;
  background-color: ${p => p.theme.colors.lightFog};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: row;
`;

const LendingTermsImg = styled.img.attrs(() => ({ src: LendingTermsIllu }))`
  width: 315px;
  height: auto;
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

const BadgeLabel = styled(Text).attrs(() => ({
  ff: "Inter|Bold",
  fontSize: 2,
  color: "wallet",
}))`
  text-transform: uppercase;
`;
