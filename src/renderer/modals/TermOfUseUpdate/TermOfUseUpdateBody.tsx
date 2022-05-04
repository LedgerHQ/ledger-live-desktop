import React from "react";
import { Flex, Icons, Link, Log, Text } from "@ledgerhq/react-ui";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { ModalBody } from "~/renderer/components/Modal";
import Button from "~/renderer/components/Button.ui";
import { openURL } from "~/renderer/linking";
import { useDynamicUrl } from "~/renderer/terms";

type Props = {
  onClose: () => void;
};

const Updates = styled.ul`
  margin-left: 16px;
`;

const BodyText = styled(Text).attrs(() => ({
  variant: "paragraph",
}))`
  font-size: 13px;
  font-weight: medium;
  color: ${p => p.theme.colors.neutral.c70};
`;

const Update = styled(BodyText).attrs(() => ({
  as: "li",
}))``;

const TermOfUseUpdateBody = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const termsUrl = useDynamicUrl("terms");

  const handleExternalLink = () => {
    openURL(termsUrl);
  };

  return (
    <ModalBody
      render={() => (
        <Flex data-test-id="terms-update-popup" flexDirection="column" alignItems="center">
          <Flex
            width="56px"
            height="56px"
            borderRadius="8px"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="neutral.c40"
            alignItems="center"
            justifyContent="center"
            mb="36px"
          >
            <Icons.ClipboardListCheckMedium size={24} />
          </Flex>
          <Log>{t("updatedTerms.title")}</Log>
          <Flex flexDirection="column">
            <BodyText mt="24px" mb="12px">
              {t("updatedTerms.body.intro")}
            </BodyText>
            <Updates>
              <Update>{t("updatedTerms.body.bulletPoints.0")}</Update>
              <Update>{t("updatedTerms.body.bulletPoints.1")}</Update>
              <Update>{t("updatedTerms.body.bulletPoints.2")}</Update>
            </Updates>
            <BodyText mt="12px">{t("updatedTerms.body.agreement")}</BodyText>
          </Flex>
        </Flex>
      )}
      renderFooter={() => (
        <Flex justifyContent="flex-end">
          <Link size="small" Icon={Icons.ExternalLinkMedium} onClick={handleExternalLink}>
            {t("updatedTerms.link")}
          </Link>
          <Button ml="24px" variant="main" outline={false} onClick={onClose}>
            {t("updatedTerms.cta")}
          </Button>
        </Flex>
      )}
    />
  );
};

export default TermOfUseUpdateBody;
