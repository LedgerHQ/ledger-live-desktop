import React, { useCallback, useState } from "react";
import { Flex, Popin, Radio, Text } from "@ledgerhq/react-ui";
import RadioElement from "@ledgerhq/react-ui/components/form/Radio/RadioElement";
import ModalStepperBody from "../ModalStepper/ModalStepperBody";
import Answer from "./Answer";
import { useTranslation } from "react-i18next";
import CloseButton from "../ModalStepper/CloseButton";

type QuizzChoice = {
  /**
   * Displayed label
   */
  label: string;
  /**
   * whether this is a correct answer
   */
  correct: boolean;
  /**
   * title to display in case this choice is chosen (allows for a different explanation for each choice)
   *    if defined, it will override the parent QuizzStep's correctAnswerTitle/incorrectAnswerTitle
   */
  specificAnswerTitle?: string;
  /**
   * description to display in case this choice is chosen (allows for a different explanation for each choice)
   *    if defined, it will override the parent QuizzStep's answerExplanation/correctAnswerExplanation/incorrectAnswerExplanation
   */
  specificAnswerExplanation?: string;
};

export type QuizzStep = {
  /**
   *  Title of the question
   */
  title: string;
  /**
   * Answer choices for this question
   */
  choices: Array<QuizzChoice>;
  /**
   * Default illustration to display on the right
   */
  Illustration?: React.ReactNode;
  /**
   * generic explanation to display on any answer
   */
  answerExplanation?: string;
  /**
   * Illustration to display on the right in case of a correct answer
   */
  CorrectAnswerIllustration?: React.ReactNode;
  /**
   * generic title to display in case the user picks a correct answer
   */
  correctAnswerTitle: string;
  /**
   * generic explanation to display in case the user picks a correct answer
   *    if defined, it will override answerExplanation
   */
  correctAnswerExplanation?: string;
  /**
   * Illustration to display on the right in case of an incorrect answer
   */
  IncorrectAnswerIllustration?: React.ReactNode;
  /**
   * generic title to display in case the user picks an incorrect answer
   */
  incorrectAnswerTitle: string;
  /**
   * generic explanation to display in case the user picks an incorrect answer
   *    if defined, it will override answerExplanation
   */
  incorrectAnswerExplanation?: string;
};

export type Props = {
  title: string;
  StartScreen: React.ReactNode;
  started?: boolean;
  steps: Array<QuizzStep>;
  onClose: () => void;
  isOpen: boolean;
  dismissable?: boolean;
};

const ModalQuizz: React.FunctionComponent<Props> = ({
  title,
  steps,
  isOpen,
  onClose = () => {},
  started,
  StartScreen,
  dismissable = true,
}: Props) => {
  const [stepIndex, setStepIndex] = useState(0);
  const stepCount = steps.length;

  const { t } = useTranslation();

  const [userChoiceIndex, setUserChoiceIndex] = useState(undefined);

  const onClickContinue = useCallback(() => {
    setUserChoiceIndex(undefined);
    if (stepIndex >= stepCount - 1) {
      // TODO: handle continue pressed on last question;
      onClose();
      setStepIndex(0);
    } else {
      setStepIndex(stepIndex + 1);
    }
  }, [stepIndex, stepCount, setStepIndex, setUserChoiceIndex, onClose]);

  const {
    title: stepTitle,
    choices,
    answerExplanation,
    correctAnswerExplanation,
    CorrectAnswerIllustration,
    correctAnswerTitle,
    Illustration,
    incorrectAnswerExplanation,
    IncorrectAnswerIllustration,
    incorrectAnswerTitle,
  } = steps[stepIndex];

  const userMadeAChoice = userChoiceIndex !== undefined;
  const userChoice = userMadeAChoice ? choices[userChoiceIndex] : undefined;
  const isCorrectChoice = userChoice ? userChoice.correct : undefined;

  const radioName = `quizz-${title}-step-${stepIndex}`;

  const AsideLeft = (
    <Flex flexDirection="column" rowGap={12}>
      <Text variant="h5">{stepTitle}</Text>
      <Radio
        name={`quizz-${title}-step-${stepIndex}`}
        onChange={value => !userMadeAChoice && setUserChoiceIndex(value)}
        currentValue={userChoiceIndex}
        containerProps={{ flexDirection: "column", rowGap: 5 }}
      >
        {choices.map(({ label, correct }: QuizzChoice, index: number) => (
          <RadioElement
            key={`${radioName}-choice-${index}`}
            label={label}
            value={`${index}`}
            variant={userMadeAChoice ? (correct ? "success" : "error") : "default"}
          />
        ))}
      </Radio>
    </Flex>
  );

  const rightSideIllustration =
    (userMadeAChoice
      ? isCorrectChoice
        ? CorrectAnswerIllustration
        : IncorrectAnswerIllustration
      : Illustration) || Illustration;

  const rightSideTitle = userMadeAChoice
    ? userChoice?.specificAnswerTitle ||
      (isCorrectChoice ? correctAnswerTitle : incorrectAnswerTitle)
    : null;

  const rightSideExplanation = userMadeAChoice
    ? userChoice?.specificAnswerExplanation ||
      (isCorrectChoice ? correctAnswerExplanation : incorrectAnswerExplanation) ||
      answerExplanation
    : null;

  const rightSideBgColor = userMadeAChoice
    ? isCorrectChoice
      ? "success.c100"
      : "error.c100"
    : "primary.c60";

  const AsideRight = (
    <Answer
      Illustration={rightSideIllustration}
      illustrationSize={userMadeAChoice ? 176 : 280}
      title={rightSideTitle}
      description={rightSideExplanation}
    />
  );

  const [width, height] = [816, 486];

  return (
    <Popin
      isOpen={isOpen}
      onClose={onClose}
      width={width}
      height={height}
      p={0}
      position="relative"
    >
      {!started && StartScreen ? (
        StartScreen
      ) : (
        <ModalStepperBody
          AsideLeft={AsideLeft}
          AsideRight={AsideRight}
          hideBackButton
          continueLabel={
            stepIndex + 1 >= stepCount
              ? t("v3.onboarding.quizz.buttons.finish")
              : t("v3.onboarding.quizz.buttons.next")
          }
          hideContinueButton={!userMadeAChoice}
          onClickContinue={onClickContinue}
          rightSideBgColor={rightSideBgColor}
          title={title}
          stepIndex={stepIndex}
          stepCount={stepCount}
        />
      )}
      {dismissable && <CloseButton onClick={onClose} />}
    </Popin>
  );
};

export default ModalQuizz;
