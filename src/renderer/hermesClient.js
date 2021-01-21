// @flow

import { io } from "socket.io-client";
import ss from "socket.io-stream";

let socket = null;

export function invoke(methodName: string, args) {
  return new Promise(resolve => {
    ss(socket).emit("invoke", methodName, args, (result: any) => {
      resolve(result);
    });
  });
}

function connect(port: number) {
  return new Promise(resolve => {
    const url = `${window.location.hostname}:${port}`;
    console.log("connecting to: ", url);

    socket = io(url, {
      withCredentials: true,
    });

    socket.once("connect", async () => {
      resolve();
    });
  });
}

function createStream(options) {
  return ss.createStream(options);
}

export const hermes = {
  connect,
  invoke,
  createStream,
};
