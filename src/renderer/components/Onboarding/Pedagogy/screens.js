// @flow

import React from "react";
import Text from "~/renderer/components/Text";
import type { TFunction } from "react-i18next";
import Button from "~/renderer/components/Button";

type ScreenProps = {
  t: TFunction,
};

export function AccessYourCoins({ t }: ScreenProps) {
  return (
    <React.Fragment>
      <Text
        mt="8px"
        color="palette.text.shade100"
        ff="Inter|SemiBold"
        fontSize="28px"
        lineHeight="33.89px"
      >
        {t("onboarding.pedagogy.screens.accessYourCoins.title")}
      </Text>
      <Text
        mt="8px"
        color="palette.text.shade100"
        ff="Inter|Regular"
        fontSize="14px"
        lineHeight="19.5px"
      >
        {t("onboarding.pedagogy.screens.accessYourCoins.description")}
      </Text>
    </React.Fragment>
  );
}

export function OwnYourPrivateKey({ t }: ScreenProps) {
  return (
    <React.Fragment>
      <Text
        mt="8px"
        color="palette.text.shade100"
        ff="Inter|SemiBold"
        fontSize="28px"
        lineHeight="33.89px"
      >
        {t("onboarding.pedagogy.screens.ownYourPrivateKey.title")}
      </Text>
      <Text
        mt="8px"
        color="palette.text.shade100"
        ff="Inter|Regular"
        fontSize="14px"
        lineHeight="19.5px"
      >
        {t("onboarding.pedagogy.screens.ownYourPrivateKey.description")}
      </Text>
    </React.Fragment>
  );
}

export function StayOffline({ t }: ScreenProps) {
  return (
    <React.Fragment>
      <Text
        mt="8px"
        color="palette.text.shade100"
        ff="Inter|SemiBold"
        fontSize="28px"
        lineHeight="33.89px"
      >
        {t("onboarding.pedagogy.screens.stayOffline.title")}
      </Text>
      <Text
        mt="8px"
        color="palette.text.shade100"
        ff="Inter|Regular"
        fontSize="14px"
        lineHeight="19.5px"
      >
        {t("onboarding.pedagogy.screens.stayOffline.description")}
      </Text>
    </React.Fragment>
  );
}

export function ValidateTransactions({ t }: ScreenProps) {
  return (
    <React.Fragment>
      <Text
        mt="8px"
        color="palette.text.shade100"
        ff="Inter|SemiBold"
        fontSize="28px"
        lineHeight="33.89px"
      >
        {t("onboarding.pedagogy.screens.validateTransactions.title")}
      </Text>
      <Text
        mt="8px"
        color="palette.text.shade100"
        ff="Inter|Regular"
        fontSize="14px"
        lineHeight="19.5px"
      >
        {t("onboarding.pedagogy.screens.validateTransactions.description")}
      </Text>
    </React.Fragment>
  );
}

export function SetUpNanoWallet({ t, sendEvent }: ScreenProps) {
  return (
    <React.Fragment>
      <Text
        mt="8px"
        color="palette.text.shade100"
        ff="Inter|SemiBold"
        fontSize="28px"
        lineHeight="33.89px"
      >
        {t("onboarding.pedagogy.screens.setUpNanoWallet.title")}
      </Text>
      <Text
        mt="8px"
        mb="24px"
        color="palette.text.shade100"
        ff="Inter|Regular"
        fontSize="14px"
        lineHeight="19.5px"
      >
        {t("onboarding.pedagogy.screens.setUpNanoWallet.description")}
      </Text>
      <Button primary onClick={() => sendEvent("DONE")}>
        <Text ff="Inter|SemiBold" fontSize="12px">
          {t("onboarding.pedagogy.screens.setUpNanoWallet.CTA")}
        </Text>
      </Button>
    </React.Fragment>
  );
}
