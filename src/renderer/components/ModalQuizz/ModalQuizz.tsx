import React, { useCallback, useState } from "react";
import {Flex, Radio} from "@ledgerhq/react-ui";
import RadioElement from "@ledgerhq/react-ui/components/form/Radio/RadioElement";

type ResultScreenProps = {
  Illustration: React.ReactNode;
  title: string;
  description: string;
}

export const GenericResultScreen = ({Illustration, title, description}: ResultScreenProps) => {

}

type QuizzChoice = {
  /**
   * 
   */
  label: string;
  /**
   * whether this is a correct answer
   */
  correct: boolean;
  /**
   * title to display in case this choice is chosen (allows for a different explanation for each choice)
   *    it will override the parent QuizzStep's correctAnswerTitle/incorrectAnswerTitle
   */
  specificAnswerTitle?: string;
  /**
   * description to display in case this choice is chosen (allows for a different explanation for each choice)
   *    it will override the parent QuizzStep's correctAnswerExplanation/incorrectAnswerExplanation
   */
  specificAnswerExplanation?: string;
}

export type QuizzStep = {
  choices: QuizzChoice[];
  title: string;
  illustration: React.ReactNode;
  correctAnswerIllustration: React.ReactNode;
  /**
   * generic title to display in case the user picks a correct answer
   */
  correctAnswerTitle: string;
  /**
   * generic explanation to display in case the user picks a correct answer
   */
  correctAnswerExplanation: string;
  incorrectAnswerIllustration: React.ReactNode;
  /**
   * generic title to display in case the user picks a correct answer
   */
  incorrectAnswerTitle: string;
  /**
   * generic explanation to display in case the user picks a correct answer
   */
  incorrectAnswerExplanation: string;
}

export type Props = {
  title: string;
  steps: QuizzStep[];
}

export default function ModalQuizz({title, steps}: Props) {
  const {stepIndex, setStepIndex} = useState(0);
  const stepCount = steps.length;

  const { userChoiceIndex, setUserChoiceIndex } = useState(null)

  const resetChoice = useCallback(() => {
    setPickedChoiceIndex(null);
  })

  const goToNextStep = useCallback(() => {
    if (stepIndex <= stepCount - 1) {
      // TODO: handle continue pressed on last question;
    }
  })

  const step = steps[stepIndex];
  const choices = step.choices;
  const userMadeAChoice = userChoiceIndex !== null;
  const userChoice = userMadeAChoice ? choices[userChoiceIndex] : null;
  const isCorrectChoice = userChoice ? userChoice.correct : null;

  const AsideLeft = (
    <Radio
      name={`quizz-${title}-step-${stepIndex}`}
      onChange={value => setUserChoiceIndex(value)}
      currentValue={userChoiceIndex}
      containerProps={{flexDirection: 'column'}}>
      {choices.map(({label, correct}: QuizzChoice, index: number) => {
        <RadioElement
          label={label}
          value={index}
          variant={userMadeAChoice ? correct ? "success" : "error" : "default"} />
      })}
    </Radio>
  )

  const rightSideIllustration = userMadeAChoice
    ? (isCorrectChoice ? step?.correctAnswerIllustration : step?.incorrectAnswerIllustration)
    : step.illustration;

  const rightSideTitle = userMadeAChoice
    ? (userChoice?.specificAnswerTitle || (isCorrectChoice ? step.correctAnswerTitle : step.incorrectAnswerTitle))
    : null;

  const rightSideExplanation = userMadeAChoice
    ? (userChoice?.specificAnswerExplanation || (isCorrectChoice ? step.correctAnswerExplanation : step.incorrectAnswerExplanation))
    : null;

  const AsideRight = null // TODO:

  return null;


}