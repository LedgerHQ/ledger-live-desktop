// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import { ModalBody } from "~/renderer/components/Modal";
import VoteTronInfoModalBodyMain from "./Main";
import VoteTronInfoModalBodyFooter from "./Footer";

type Props = {
  onClose: () => void,
};

export default function VoteTronInfoModalBody({ onClose }: Props) {
  const { t } = useTranslation();

  return (
    <ModalBody
      title={t("tron.manage.vote.steps.vote.title")}
      onClose={onClose}
      noScroll
      render={() => <VoteTronInfoModalBodyMain />}
      renderFooter={() => <VoteTronInfoModalBodyFooter />}
    />
  );
}
