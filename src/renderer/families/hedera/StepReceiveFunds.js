// @flow
import React from "react";
import { Trans } from "react-i18next";
import Alert from "~/renderer/components/Alert";

type Props = {
    name: string
}

export const HederaReceiveAddressWarning = ({ name }: Props) => {

    return (
        <Alert type="security" mt={4}>
            <Trans i18nKey="Hedera.currentAddress.messageIfVirtual" values={{ name }} />
        </Alert>
    );
  };