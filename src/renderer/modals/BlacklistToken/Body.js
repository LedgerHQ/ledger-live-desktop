// @flow

import Box from "~/renderer/components/Box";
import { Trans, useTranslation } from "react-i18next";
import Text from "~/renderer/components/Text";
import ModalBody from "~/renderer/components/Modal/ModalBody";
import React from "react";
import Footer from "~/renderer/modals/BlacklistToken/Footer";
import type { TokenCurrency } from "@ledgerhq/live-common/lib/types";

const Body = ({ onClose, token }: { onClose: () => void, token: TokenCurrency }) => {
  const { t } = useTranslation();

  return (
    <ModalBody
      preventBackdropClick
      onClose={onClose}
      title={t("blacklistToken.title")}
      render={() => (
        <Box>
          <Box
            ff="Inter|Regular"
            fontSize={4}
            color="palette.text.shade60"
            textAlign="center"
            mb={2}
            mt={3}
          >
            <Trans i18nKey="blacklistToken.desc" parent="div" values={{ tokenName: token.name }}>
              {"This action will hide all "}
              {/* $FlowFixMe */}
              <Text ff="Inter|SemiBold" color="palette.text.shade100">
                {{ tokenName: token.name }}
              </Text>
              {"accounts, you can restore their visibility at any time from "}
              <Text ff="Inter|SemiBold" color="palette.text.shade100">
                {"Settings"}
              </Text>
            </Trans>
          </Box>
        </Box>
      )}
      renderFooter={() => <Footer token={token} onClose={onClose} />}
    />
  );
};

export default Body;
