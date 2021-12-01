import React, { useCallback, useState } from "react";
import { Box, Flex, Popin, Radio, Text } from "@ledgerhq/react-ui";
import RadioElement from "@ledgerhq/react-ui/components/form/Radio/RadioElement";
import ModalStepperBody from "../ModalStepper/ModalStepperBody";

type ResultScreenProps = {
  Illustration?:
    | React.ComponentType<{ size?: number }>
    | ((props: { size?: number }) => React.ReactNode);
  illustrationSize?: number;
  title?: string | null;
  description?: string | null;
};

export const GenericResultScreen = ({
  Illustration,
  illustrationSize,
  title,
  description,
}: ResultScreenProps) => {
  return (
    <Flex flexDirection="column" alignItems="center" alignSelf="center" p={12}>
      {Illustration && <Illustration size={illustrationSize} />}
      {title && (
        <Text variant="h1" mt={7} mb={5}>
          {title}
        </Text>
      )}
      {description && (
        <Text variant="paragraph" fontWeight="medium" textAlign="center">
          {description}
        </Text>
      )}
    </Flex>
  );
};

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
  title: string;
  choices: Array<QuizzChoice>;
  Illustration?: React.ReactNode;
  /**
   * generic explanation to display on any answer
   */
  answerExplanation?: string;
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
  IncorrectAnswerIllustration?: React.ReactNode;
  /**
   * generic title to display in case the user picks a correct answer
   */
  incorrectAnswerTitle: string;
  /**
   * generic explanation to display in case the user picks a correct answer
   *    if defined, it will override answerExplanation
   */
  incorrectAnswerExplanation?: string;
};

export type Props = {
  title: string;
  steps: Array<QuizzStep>;
  onClose: () => void;
  isOpen: boolean;
};

const ModalQuizz: React.FC<Props> = (props: Props) => {
  const { title, steps, isOpen, onClose = () => {} } = props;
  const [stepIndex, setStepIndex] = useState(0);
  const stepCount = steps.length;

  const [userChoiceIndex, setUserChoiceIndex] = useState(undefined);

  const onClickContinue = useCallback(() => {
    setUserChoiceIndex(undefined);
    if (stepIndex >= stepCount - 1) {
      // TODO: handle continue pressed on last question;
      setStepIndex(0);
    } else {
      setStepIndex(stepIndex + 1);
    }
  }, [stepIndex, stepCount, setStepIndex, setUserChoiceIndex]);

  const step = steps[stepIndex];
  const choices = step.choices;
  const userMadeAChoice = userChoiceIndex !== undefined;
  const userChoice = userMadeAChoice ? choices[userChoiceIndex] : undefined;
  const isCorrectChoice = userChoice ? userChoice.correct : undefined;

  const radioName = `quizz-${title}-step-${stepIndex}`;

  const AsideLeft = (
    <Flex flexDirection="column" rowGap={12}>
      <Text variant="h5">{step.title}</Text>
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
        ? step.CorrectAnswerIllustration
        : step.IncorrectAnswerIllustration
      : step.Illustration) || step.Illustration;

  const rightSideTitle = userMadeAChoice
    ? userChoice?.specificAnswerTitle ||
      (isCorrectChoice ? step.correctAnswerTitle : step.incorrectAnswerTitle)
    : null;

  const rightSideExplanation = userMadeAChoice
    ? userChoice?.specificAnswerExplanation ||
      (isCorrectChoice ? step.correctAnswerExplanation : step.incorrectAnswerExplanation) ||
      step.answerExplanation
    : null;

  const rightSideBgColor = userMadeAChoice
    ? isCorrectChoice
      ? "success.c100"
      : "error.c100"
    : "primary.c60";

  const AsideRight = (
    <GenericResultScreen
      Illustration={rightSideIllustration}
      illustrationSize={userMadeAChoice ? 176 : 280}
      title={rightSideTitle}
      description={rightSideExplanation}
    />
  );

  const [width, height] = [816, 486];

  return (
    <Popin isOpen={isOpen} onClose={onClose} width={width} height={height} p={0}>
      <ModalStepperBody
        AsideLeft={AsideLeft}
        AsideRight={AsideRight}
        hideBackButton
        hideContinueButton={!userMadeAChoice}
        onClickContinue={onClickContinue}
        rightSideBgColor={rightSideBgColor}
        title={title}
        stepIndex={stepIndex}
        stepCount={stepCount}
      />
    </Popin>
  );
};

export default ModalQuizz;
