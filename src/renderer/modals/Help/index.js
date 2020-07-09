// @flow

import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

// icons
import IconHelp from "~/renderer/icons/Help";
import IconGithub from "~/renderer/icons/Github";
import IconTwitter from "~/renderer/icons/Twitter";
import IconFacebook from "~/renderer/icons/Facebook";
import IconShield from "~/renderer/icons/Shield2";
import IconNano from "~/renderer/icons/Nano";

import { openURL } from "~/renderer/linking";
import Text from "~/renderer/components/Text";
import TrackPage from "~/renderer/analytics/TrackPage";
import Modal from "~/renderer/components/Modal";
import ModalBody from "~/renderer/components/Modal/ModalBody";

const LinkCardContainer = styled.a`
  border: 1px solid ${p => p.theme.colors.palette.text.shade30};
  border-radius: 4px;
  margin: 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    filter: brightness(85%);
  }

  &:active {
    filter: brightness(60%);
  }
`;

const IconContainer = styled.div`
  margin-bottom: 32px;
  color: ${p => p.theme.colors.palette.primary.main};
`;

const LinkCard = ({
  Icon,
  title,
  desc,
  url,
}: {
  Icon: any,
  title: string,
  desc: string,
  url: string,
}) => {
  return (
    <LinkCardContainer onClick={() => openURL(url)}>
      <IconContainer>
        <Icon size={22} />
      </IconContainer>
      <Text ff="Inter|SemiBold" fontSize={4} color={"palette.text.shade100"}>
        {title}
      </Text>
      <Text ff="Inter|Medium" fontSize={3} color={"palette.text.shade60"}>
        {desc}
      </Text>
    </LinkCardContainer>
  );
};

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: -8px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

const HelpModal = () => {
  const { t } = useTranslation();

  return (
    <Modal name="MODAL_HELP" centered>
      <ModalBody
        title={t("help.title")}
        render={() => (
          <>
            <TrackPage category="Modal" name="Help" />
            <GridContainer>
              <RowContainer>
                <LinkCard
                  title={t("help.gettingStarted.title")}
                  desc={t("help.gettingStarted.desc")}
                  url={
                    "https://www.ledger.com/start?utm_source=ledger_live&utm_medium=self_referral&utm_content=help_desktop"
                  }
                  Icon={IconNano}
                />
                <LinkCard
                  title={t("help.helpCenter.title")}
                  desc={t("help.helpCenter.desc")}
                  url={
                    "https://support.ledger.com/hc/en-us?utm_source=ledger_live&utm_medium=self_referral&utm_content=help_desktop"
                  }
                  Icon={IconHelp}
                />
                <LinkCard
                  title={t("help.ledgerAcademy.title")}
                  desc={t("help.ledgerAcademy.desc")}
                  url={
                    "https://www.ledger.com/academy/?utm_source=ledger_live&utm_medium=self_referral&utm_content=help_desktop"
                  }
                  Icon={IconShield}
                />
              </RowContainer>
              <RowContainer>
                <LinkCard
                  title={t("help.facebook.title")}
                  desc={t("help.facebook.desc")}
                  url={"https://www.facebook.com/Ledger/"}
                  Icon={IconFacebook}
                />
                <LinkCard
                  title={t("help.twitter.title")}
                  desc={t("help.twitter.desc")}
                  url={"https://twitter.com/ledger"}
                  Icon={IconTwitter}
                />
                <LinkCard
                  title={t("help.github.title")}
                  desc={t("help.github.desc")}
                  url={"https://github.com/LedgerHQ"}
                  Icon={IconGithub}
                />
              </RowContainer>
            </GridContainer>
          </>
        )}
      />
    </Modal>
  );
};

export default HelpModal;
