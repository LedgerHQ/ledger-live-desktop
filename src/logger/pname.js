// @flow

// Infer a "pname" aka short id version of process name

const pname =
  typeof window === "undefined"
    ? process.env.IS_INTERNAL_PROCESS
      ? "internal"
      : "main"
    : "renderer";

export default pname;
