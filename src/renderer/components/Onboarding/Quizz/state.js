import { assign, createMachine, actions } from "xstate";

const { choose } = actions;

const questions = [
  {
    text: "onboarding.quizz.questions.1.text",
    answers: [
      {
        text: "onboarding.quizz.questions.1.answers.1",
        correct: false,
      },
      {
        text: "onboarding.quizz.questions.1.answers.2",
        correct: true,
      },
    ],
    results: {
      success: {
        title: "onboarding.quizz.questions.1.results.success.title",
        text: "onboarding.quizz.questions.1.results.success.text",
      },
      fail: {
        title: "onboarding.quizz.questions.1.results.fail.title",
        text: "onboarding.quizz.questions.1.results.fail.text",
      },
    },
  },
  {
    text: "onboarding.quizz.questions.2.text",
    answers: [
      {
        text: "onboarding.quizz.questions.2.answers.1",
        correct: false,
      },
      {
        text: "onboarding.quizz.questions.2.answers.2",
        correct: true,
      },
    ],
    results: {
      success: {
        title: "onboarding.quizz.questions.2.results.success.title",
        text: "onboarding.quizz.questions.2.results.success.text",
      },
      fail: {
        title: "onboarding.quizz.questions.2.results.fail.title",
        text: "onboarding.quizz.questions.2.results.fail.text",
      },
    },
  },
  {
    text: "onboarding.quizz.questions.3.text",
    answers: [
      {
        text: "onboarding.quizz.questions.3.answers.1",
        correct: true,
      },
      {
        text: "onboarding.quizz.questions.3.answers.2",
        correct: false,
      },
    ],
    results: {
      success: {
        title: "onboarding.quizz.questions.3.results.success.title",
        text: "onboarding.quizz.questions.3.results.success.text",
      },
      fail: {
        title: "onboarding.quizz.questions.3.results.fail.title",
        text: "onboarding.quizz.questions.3.results.fail.text",
      },
    },
  },
];

export const quizzMachineGenerator = (id, questions) => {
  const baseConfig = {
    id,
    initial: "intro",
    context: {
      score: 0,
      results: {},
    },
    states: {
      intro: {
        on: {
          START: {
            target: "question-0",
          },
        },
        meta: {
          UI: "intro",
        },
      },
      done: {
        entry: choose([
          {
            actions: ["onWin"],
            cond: ({ score }) => score > 2,
          },
          { actions: ["onLose"] },
        ]),
        always: {
          target: "question-0",
        },
      },
    },
  };

  return createMachine(
    questions.reduce((config, question, index) => {
      const questionId = `question-${index}`;
      const resultId = `result-${index}`;

      config.states[questionId] = {
        on: {
          ANSWERED: {
            target: resultId,
            actions: assign((context, { answerIndex }) => {
              const selectedAnwser = question.answers[answerIndex];
              return {
                score: selectedAnwser.correct ? context.score + 1 : context.score,
                results: {
                  ...context.results,
                  [resultId]: selectedAnwser.correct ? "success" : "fail",
                },
              };
            }),
          },
        },
        meta: {
          UI: "question",
          text: question.text,
          answers: question.answers,
        },
      };

      config.states[resultId] = {
        on: {
          NEXT: {
            target: index + 1 === questions.length ? "done" : `question-${index + 1}`,
          },
        },
        meta: {
          UI: "result",
          success: question.results.success,
          fail: question.results.fail,
        },
      };

      return config;
    }, baseConfig),
  );
};

export const quizzMachine = quizzMachineGenerator("quizzMachine", questions);
