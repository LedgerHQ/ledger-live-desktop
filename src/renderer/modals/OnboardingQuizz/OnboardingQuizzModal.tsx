import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { closeModal } from "~/renderer/actions/modals";
import ModalQuizz from "~/renderer/components/ModalQuizz/ModalQuizz";
import { getQuizzSteps } from "./quizzSteps";
import StartScreen from "./StartScreen";
import { noop } from "lodash";

type PopinProps = {
  isOpen: boolean;
  onClose?: () => void;
  onLose: () => void;
  onWin: () => void;
};

export const QuizzPopin = ({ onWin, isOpen, onLose, onClose = noop }: PopinProps) => {
  const { t } = useTranslation();
  if (!isOpen) return null;
  return (
    <ModalQuizz
      title={t("v3.onboarding.quizz.heading")}
      isOpen
      onClose={onClose}
      onWin={onWin}
      onLose={onLose}
      steps={getQuizzSteps(t)}
      StartScreen={StartScreen}
    />
  );
};

export default function QuizzModal() {
  const dispatch = useDispatch();
  const onClose = useCallback(() => {
    dispatch(closeModal("MODAL_ONBOARDING_QUIZZ"));
  }, [dispatch]);
  return <QuizzPopin isOpen onClose={onClose} onWin={noop} onLose={noop} />;
}
