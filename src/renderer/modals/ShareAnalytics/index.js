// @flow

import React, { PureComponent } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import type { TFunction } from "react-i18next";
import { closeModal } from "~/renderer/actions/modals";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import { Trans, withTranslation } from "react-i18next";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";

type Props = {
  t: TFunction,
  closeModal: string => void,
};
const mapDispatchToProps = {
  closeModal,
};

class ShareAnalyticsC extends PureComponent<Props, *> {
  onClose = () => this.props.closeModal("MODAL_SHARE_ANALYTICS");
  render() {
    const { t } = this.props;
    const items = [
      {
        key: "item1",
        desc: t("onboarding.analytics.shareAnalytics.mandatoryContextual.item1"),
      },
      {
        key: "item2",
        desc: t("onboarding.analytics.shareAnalytics.mandatoryContextual.item2"),
      },
      {
        key: "item3",
        desc: t("onboarding.analytics.shareAnalytics.mandatoryContextual.item3"),
      },
      {
        key: "item4",
        desc: t("onboarding.analytics.shareAnalytics.mandatoryContextual.item4"),
      },
      {
        key: "item5",
        desc: t("onboarding.analytics.shareAnalytics.mandatoryContextual.item5"),
      },
      {
        key: "item6",
        desc: t("onboarding.analytics.shareAnalytics.mandatoryContextual.item6"),
      },
      {
        key: "item7",
        desc: t("onboarding.analytics.shareAnalytics.mandatoryContextual.item7"),
      },
      {
        key: "item8",
        desc: t("onboarding.analytics.shareAnalytics.mandatoryContextual.item8"),
      },
      {
        key: "item9",
        desc: t("onboarding.analytics.shareAnalytics.mandatoryContextual.item9"),
      },
    ];
    return (
      <Modal name="MODAL_SHARE_ANALYTICS" onClose={this.onClose} centered>
        <ModalBody
          onClose={this.onClose}
          title={t("onboarding.analytics.shareAnalytics.title")}
          render={() => (
            <>
              <InlineDesc>
                <Trans i18nKey="onboarding.analytics.shareAnalytics.desc" />
              </InlineDesc>
              <Box mx={5}>
                <Ul>
                  {items.map(item => (
                    <li key={item.key}>{item.desc}</li>
                  ))}
                </Ul>
              </Box>
            </>
          )}
          renderFooter={() => (
            <>
              <Button onClick={this.onClose} primary>
                <Trans i18nKey="common.close" />
              </Button>
            </>
          )}
        />
      </Modal>
    );
  }
}

const ShareAnalytics: React$ComponentType<{}> = compose(
  withTranslation(),
  connect(null, mapDispatchToProps),
)(ShareAnalyticsC);

export default ShareAnalytics;

export const Ul: ThemedComponent<{}> = styled.ul.attrs(() => ({
  ff: "Inter|Regular",
}))`
  margin-top: 15px;
  font-size: 13px;
  color: ${p => p.theme.colors.palette.text.shade80};
  line-height: 1.69;
`;
export const InlineDesc: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|SemiBold",
  fontSize: 4,
  color: "palette.text.shade100",
  mx: "15px",
}))``;
