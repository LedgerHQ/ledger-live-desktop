import { createMachine, assign, actions } from "xstate";
import { track } from "~/renderer/analytics/segment";
// Solutions
import ChangeUSBCable from "./solutions/ChangeUSBCable";
import DifferentPort from "./solutions/DifferentPort";
import RestartComputer from "./solutions/RestartComputer";
import RunAsAdmin from "./solutions/RunAsAdmin";
import TryAnotherComputer from "./solutions/TryAnotherComputer";
import TurnOffAntivirus from "./solutions/TurnOffAntivirus";
import UpdateUdevRules from "./solutions/UpdateUdevRules";
import UpdateUSBDeviceDrivers from "./solutions/UpdateUSBDeviceDrivers";
import EnableFullDiskAccess from "./solutions/EnableFullDiskAccess";
import ResetNVRAM from "./solutions/ResetNVRAM";
import RepairFunnel from "./solutions/RepairFunnel";

const commonSolutions = [
  DifferentPort,
  ChangeUSBCable,
  RestartComputer,
  TurnOffAntivirus,
  TryAnotherComputer,
];

const { choose } = actions;

const detectedPlatform =
  process.platform === "darwin" ? "mac" : process.platform === "win32" ? "windows" : "linux";

export default createMachine(
  {
    id: "USBTroubleshooting",
    initial: "solution",
    context: {
      opened: true,
      done: false,
      SolutionComponent: () => null,
      platform: process.env.USBTROUBLESHOOTING_PLATFORM || detectedPlatform,
      currentIndex: undefined,
      solutions: {
        mac: [...commonSolutions, EnableFullDiskAccess, ResetNVRAM, RepairFunnel],
        windows: [RunAsAdmin, ...commonSolutions, UpdateUSBDeviceDrivers, RepairFunnel],
        linux: [UpdateUdevRules, ...commonSolutions, RepairFunnel],
      },
    },
    states: {
      solution: {
        entry: [
          choose([
            {
              actions: "next",
              cond: ({ currentIndex }) => currentIndex === undefined, // Nb Prevent 'next' if we are already in the flow,
            },
          ]),
          "load",
          "log",
        ],
        on: {
          NEXT: {
            actions: ["next", "load", "log"],
          },
          PREVIOUS: {
            actions: ["previous", "load", "log"],
          },
          DONE: {
            actions: ["done", "log"],
          },
        },
      },
    },
  },
  {
    actions: {
      load: assign(({ platform, currentIndex, solutions }) => {
        if (!solutions[platform]) throw new Error(`Unknown platform ${platform}`);
        const index =
          !currentIndex || currentIndex >= solutions[platform].length ? 0 : currentIndex;
        const SolutionComponent = solutions[platform][index];

        return {
          currentIndex: index,
          SolutionComponent,
        };
      }),
      // For Nano X and Blue, after all options, we give up.
      done: assign({ done: true }),
      // Move forwards to another solution.
      next: assign(({ platform, currentIndex: i, solutions }) => {
        const currentIndex = solutions[platform].length > i + 1 ? i + 1 : i;
        return {
          currentIndex,
        };
      }),
      // Move back to a previous solution.
      previous: assign(({ platform, currentIndex: i, solutions }) => {
        const currentIndex = solutions[platform].length <= 0 ? 0 : i - 1;
        return {
          currentIndex,
        };
      }),
      // Tracking actions
      log: (context, event) =>
        track(`USBTroubleshooting ${event.type}`, {
          event,
          detectedPlatform,
          currentIndex: context.currentIndex,
        }),
    },
  },
);
