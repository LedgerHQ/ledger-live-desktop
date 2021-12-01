import { Icons } from "@ledgerhq/react-ui";
import React from "react";
import ModalQuizz from "~/renderer/components/ModalQuizz/ModalQuizz";

const Illustration = Icons.BracketsUltraLight;

const quizzSteps = [
  {
    title: "As a Ledger user, my crypto is stored:",
    Illustration,
    choices: [
      {
        label: "On my Nano",
        correct: false,
      },
      {
        label: "On the blockchain",
        correct: true,
      },
    ],
    correctAnswerTitle: "Congrats!",
    incorrectAnswerTitle: "Incorrect!",
    answerExplanation:
      "Your crypto is always stored on the blockchain. Your hardware wallet only holds your private key, which gives access to your crypto.",
  },
  {
    title: "If my recovery phrase is no longer secure or private...",
    Illustration,
    choices: [
      {
        label: "No problem, Ledger can send me a copy",
        correct: false,
      },
      {
        label:
          "My wallet is compromised. I need to generate a new recovery phrase and transfer all my coins to it from the old one",
        correct: true,
      },
    ],
    correctAnswerTitle: "Congrats!",
    incorrectAnswerTitle: "Incorrect!",
    answerExplanation:
      "Anyone who knows your recovery phrase can steal your crypto assets. If you lose it, you must quickly transfer your crypto to a secure place.",
  },
  {
    title: "When I connect my Nano to the Ledger app, my private key is...",
    Illustration,
    choices: [
      {
        label: "Still offline",
        correct: true,
      },
      {
        label: "Briefly connected to the Internet",
        correct: false,
      },
    ],
    correctAnswerTitle: "Congrats!",
    incorrectAnswerTitle: "Incorrect!",
    answerExplanation:
      "Your private key always remains offline in your hardware wallet. Even when connected to your Nano, the Ledger app cannot access your private key. You must physically authorize every transaction on your device.",
  },
];

export default function QuizzModal() {
  return (
    <ModalQuizz title="Quizz" isOpen steps={quizzSteps} onClose={() => {}} onFinish={() => {}} />
  );
}
