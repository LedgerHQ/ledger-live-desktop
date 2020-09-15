// @flow

import React, { PureComponent } from "react";
import { compose } from "redux";
import type { TFunction } from "react-i18next";
import { closeModal } from "~/renderer/actions/modals";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import Box from "~/renderer/components/Box";
import { InlineDesc, Ul } from "~/renderer/modals/ShareAnalytics";
import { Trans, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import Button from "~/renderer/components/Button";

type Props = {
  t: TFunction,
  closeModal: string => void,
};

const mapDispatchToProps = {
  closeModal,
};

class TechnicalData extends PureComponent<Props, *> {
  onClose = () => this.props.closeModal("MODAL_TECHNICAL_DATA");

  render() {
    const { t } = this.props;

    const items = [
      {
        key: "item1",
        desc: t("onboarding.analytics.technicalData.mandatoryContextual.item1"),
      },
      {
        key: "item2",
        desc: t("onboarding.analytics.technicalData.mandatoryContextual.item2"),
      },
      {
        key: "item3",
        desc: t("onboarding.analytics.technicalData.mandatoryContextual.item3"),
      },
    ];

    return (
      <Modal name="MODAL_TECHNICAL_DATA" onClose={this.onClose} centered>
        <ModalBody
          onClose={this.onClose}
          title={t("onboarding.analytics.technicalData.mandatoryContextual.title")}
          render={() => (
            <>
              <InlineDesc>
                <Trans i18nKey="onboarding.analytics.technicalData.desc" />
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

export default compose(withTranslation(), connect(null, mapDispatchToProps))(TechnicalData);
