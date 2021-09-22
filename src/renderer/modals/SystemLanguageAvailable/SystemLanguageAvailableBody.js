// @flow
import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import styled from "styled-components";

import { ModalBody } from "~/renderer/components/Modal";
import Box from "~/renderer/components/Box";
import TrackPage from "~/renderer/analytics/TrackPage";
import Text from "~/renderer/components/Text";
import Link from "~/renderer/components/Link";
import Button from "~/renderer/components/Button";
import Language from "~/renderer/icons/Language";

import { rgba } from "~/renderer/styles/helpers";

type Props = {
  currentLanguage: string,
  osLanguage: string,
  onClose: () => void,
  t: TFunction,
};

type State = {

}

const Title = styled(Text).attrs(() => ({
  ff: "Inter",
  fontSize: 18,
  color: "palette.text.shade100",
  textAlign: "center",
  fontWeight: 600,
  marginBottom: 16,
}))``;

const Content = styled(Text).attrs(() => ({
  ff: "Inter",
  fontSize: 13,
  color: "palette.text.shade50",
  textAlign: "center",
  marginBottom: 13 * 1.4,
}))``;

const NoLink = styled(Link).attrs(() => ({
  fontSize: 13,
  color: "palette.text.shade50",
  padding: "0 30px",
}))``;

const Circle = styled.div`
  height: 72px;
  width: 72px;
  border-radius: 72px;
  background-color: ${p => rgba(p.theme.colors.palette.primary.main, 0.1)};
`;

const IconBox = styled(Box).attrs(() => ({
  margin: "auto",
  textAlign: "center",
  position: "relative",
  marginBottom: 24,
}))``;

const LanguageBox = styled(Box).attrs((p) => ({
  position: "absolute",
  top: 16,
  left: 16,
  color: "palette.primary.main",
}))``;

class SystemLanguageAvailableBody extends PureComponent<Props, State> {
  state = {
  };

  renderContent = () => {
    const { t } = this.props;

    return (
      <Box horizontal alignItems="center">

      </Box>
    );
  };

  render() {
    const { onClose, t, osLanguage } = this.props;
    const osLanguageTest = "en";
    const targetLanguageTranslated = t("language.switcher." + osLanguageTest);
    // const targetLanguageTranslated = languageLabels
  

    return (
      <ModalBody
        onClose={onClose}
        render={() => (
          <Box>
            <TrackPage category="Modal" name="SystemLanguageAvailable" />
            <IconBox>
              <Circle />
              <LanguageBox>
                <Language />
              </LanguageBox>
            </IconBox>
            <Title>{t("systemLanguageAvailable.title")}</Title>
            <Content>
              {t("systemLanguageAvailable.bullet.0", { language: targetLanguageTranslated })}
            </Content>
            <Content>{t("systemLanguageAvailable.bullet.1")}</Content>
          </Box>
        )}
        renderFooter={() => (
          <Box horizontal justifyContent="flex-end">
            <NoLink>{t("systemLanguageAvailable.no")}</NoLink>
            <Button onClick={onClose} primary>
              {`${t("systemLanguageAvailable.switchButton")} ${targetLanguageTranslated}`}
            </Button>
          </Box>
        )}
      />
    );
  }
}

export default withTranslation()(SystemLanguageAvailableBody);
