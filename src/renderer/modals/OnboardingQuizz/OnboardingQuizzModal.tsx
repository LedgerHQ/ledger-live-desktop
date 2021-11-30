import React from "react";
import ModalStepper from "~/renderer/components/ModalStepper";
import { stepperSteps } from "~/renderer/components/ModalStepper/testModal";

export default function QuizzModal() {
  return <ModalStepper title="quizz" isOpen steps={stepperSteps} onClose={() => {}} onFinish={() => {}} />
}
