// @flow
import React, { useCallback } from "react";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";
// icons
import IconHelp from "~/renderer/icons/Help";
import IconGithub from "~/renderer/icons/Github";
import IconTwitter from "~/renderer/icons/Twitter";
import IconActivity from "~/renderer/icons/Activity";
import { connect } from "react-redux";
import IconFacebook from "~/renderer/icons/Facebook";
import IconBook from "~/renderer/icons/Book";
import IconNano from "~/renderer/icons/Nano";
import { openURL } from "~/renderer/linking";
import Text from "~/renderer/components/Text";
import TrackPage from "~/renderer/analytics/TrackPage";
import Modal from "~/renderer/components/Modal";
import FakeLink from "~/renderer/components/FakeLink";
import Box from "~/renderer/components/Box";
import ModalBody from "~/renderer/components/Modal/ModalBody";
import { closeModal } from "~/renderer/actions/modals";
import { urls } from "~/config/urls";

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
const Circle = styled(Box)`
  height: 28px;
  width: 28px;
  align-items: center;
  justify-content: center;
  display: flex;
  border-radius: 50%;
  background-color: ${p => p.theme.colors.pillActiveBackground};
  color: ${p => p.theme.colors.palette.primary.main};
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
const mapDispatchToProps = {
  closeModal,
};
type Props = { closeModal: string => void };
const HelpModal = ({ closeModal }: Props) => {
  const { t } = useTranslation();
  const onClose = useCallback(() => closeModal("MODAL_HELP"), [closeModal]);
  return (
    <Modal name="MODAL_HELP" centered>
      <ModalBody
        onClose={onClose}
        title={t("help.title")}
        renderFooter={() => (
          <Box flex={1} horizontal justifyContent="center" alignItems="center" color="wallet">
            <Circle>
              <IconActivity size={14} />
            </Circle>
            <Text ff="Inter|SemiBold" fontSize={4} style={{ marginLeft: 8 }}>
              <FakeLink onClick={() => openURL(urls.helpModal.status)}>
                <Trans i18nKey="help.status" />
              </FakeLink>
            </Text>
          </Box>
        )}
        render={() => (
          <>
            <TrackPage category="Modal" name="Help" />
            <GridContainer>
              <RowContainer>
                <LinkCard
                  title={t("help.gettingStarted.title")}
                  desc={t("help.gettingStarted.desc")}
                  url={urls.helpModal.gettingStarted}
                  Icon={IconNano}
                />
                <LinkCard
                  title={t("help.helpCenter.title")}
                  desc={t("help.helpCenter.desc")}
                  url={urls.helpModal.helpCenter}
                  Icon={IconHelp}
                />
                <LinkCard
                  title={t("help.ledgerAcademy.title")}
                  desc={t("help.ledgerAcademy.desc")}
                  url={urls.helpModal.ledgerAcademy}
                  Icon={IconBook}
                />
              </RowContainer>
              <RowContainer>
                <LinkCard
                  title={t("help.facebook.title")}
                  desc={t("help.facebook.desc")}
                  url={urls.social.facebook}
                  Icon={IconFacebook}
                />
                <LinkCard
                  title={t("help.twitter.title")}
                  desc={t("help.twitter.desc")}
                  url={urls.social.twitter}
                  Icon={IconTwitter}
                />
                <LinkCard
                  title={t("help.github.title")}
                  desc={t("help.github.desc")}
                  url={urls.social.github}
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
const C: React$ComponentType<Props> = connect(null, mapDispatchToProps)(HelpModal);
export default C;
