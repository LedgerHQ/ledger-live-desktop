import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { closeModal } from "~/renderer/actions/modals";
import ModalQuizz from "~/renderer/components/ModalQuizz/ModalQuizz";
import { getQuizzSteps } from "./quizzSteps";
import StartScreen from "./StartScreen";

export default function QuizzModal() {
  const [started, setStarted] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const onClose = useCallback(() => {
    dispatch(closeModal("MODAL_ONBOARDING_QUIZZ"));
  }, [dispatch]);
  // const onCloseLoop = useCallback(() => {
  //   setStarted(false);
  // }, [setStarted]);
  return (
    <ModalQuizz
      started={started}
      title={t("v3.onboarding.quizz.heading")}
      isOpen
      steps={getQuizzSteps(t)}
      onClose={onClose}
      StartScreen={<StartScreen onStart={() => setStarted(true)} />}
    />
  );
}
