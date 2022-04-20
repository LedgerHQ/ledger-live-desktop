import React, { useCallback } from "react";
import { Popin, Text, Flex, Checkbox, Button, Icons } from "@ledgerhq/react-ui";
import { useTranslation, Trans } from "react-i18next";
import { acceptTerms, useDynamicUrl } from "~/renderer/terms";
import { setShareAnalytics } from "~/renderer/actions/settings";
import { openURL } from "~/renderer/linking";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const TermsAndConditionsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  setOpenedTermsModal: (isOpened: boolean) => void;
}> = ({ isOpen, onClose, setOpenedTermsModal }) => {
  const { t } = useTranslation();

  const [acceptedTermsOfUse, setAcceptedTermsOfUse] = React.useState(false);
  const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = React.useState(false);

  const termsUrl = useDynamicUrl("terms");
  const privacyPolicyUrl = useDynamicUrl("privacyPolicy");

  const dispatch = useDispatch();
  const history = useHistory();

  const handleAcceptTermsOfUse = useCallback(() => {
    acceptTerms();
    dispatch(setShareAnalytics(true));
    setOpenedTermsModal(false);
    history.push("/onboarding/select-device");
  }, [dispatch, setOpenedTermsModal, history]);

  return (
    <Popin isOpen={isOpen} onClose={onClose} width={622} height={220}>
      <Flex justifyContent="center" mt={4} mb={3}>
        <Text variant="h2" textTransform="uppercase">
          {t("Terms.title")}
        </Text>
      </Flex>
      <Flex mt={5} ml={5}>
        <Checkbox
          name="termsOfUseCheckbox"
          onChange={e => setAcceptedTermsOfUse(e.target.checked)}
          isChecked={acceptedTermsOfUse}
          label={
            <Trans i18nKey="Terms.termsCheckboxLabel">
              <></>
              <a href="javascript: void(0)" onClick={() => openURL(termsUrl)}></a>
            </Trans>
          }
        />
      </Flex>
      <Flex mt={2} ml={5}>
        <Checkbox
          name="privacyPolicyCheckbox"
          onChange={e => setAcceptedPrivacyPolicy(e.target.checked)}
          isChecked={acceptedPrivacyPolicy}
          label={
            <Trans i18nKey="Terms.privacyCheckboxLabel">
              <></>
              <a href="javascript: void(0)" onClick={() => openURL(privacyPolicyUrl)}></a>
            </Trans>
          }
        />
      </Flex>
      <Flex justifyContent="center" mt={8}>
        <Button
          data-testid="onboarding-cta-done"
          onClick={handleAcceptTermsOfUse}
          variant="main"
          color="palette.neutral.c100"
          Icon={() => <Icons.ArrowRightMedium size={18} />}
          disabled={!acceptedTermsOfUse || !acceptedPrivacyPolicy}
        >
          {t("common.continue")}
        </Button>
      </Flex>
    </Popin>
  );
};

export default TermsAndConditionsModal;
