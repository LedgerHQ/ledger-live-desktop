import React from "react";

const step = {
  title: "Access your crypto",
  description:
    "Your crypto assets are stored on the blockchain. You need a private key to access and manage them.",
  AsideRight: <div style={{ height: 200, width: 100, backgroundColor: "lightgreen" }} />,
};

const step2 = {
  title: "Own your private key",
  description:
    "Your private key is stored within your Nano. You must be the only one to own it to be in control of your money.",
  AsideRight: <div style={{ height: 150, width: 200, backgroundColor: "lightblue" }} />,
};

const step3 = {
  title: "Stay offline",
  description:
    'Your Nano works as a "cold storage" wallet. This means that it never exposes your private key online, even when using the app.',
  AsideRight: <div style={{ height: 300, width: 80, backgroundColor: "lightcoral" }} />,
};

const step4 = {
  title: "Validate transactions",
  description:
    "Ledger Live allows you to buy, sell, manage, exchange and earn crypto while remaining protected. You will validate every crypto transaction with your Nano.",
  AsideRight: <div style={{ height: 300, width: 80, backgroundColor: "lightgreen" }} />,
};

const step5 = {
  title: "Let’s setup your Ledger Nano x!",
  description: "We’ll start by setting up your Nano security.",
  AsideRight: <div style={{ height: 300, width: 100, backgroundColor: "lightgreen" }} />,
};

export const stepperSteps = [step, step2, step3, step4, step5];
