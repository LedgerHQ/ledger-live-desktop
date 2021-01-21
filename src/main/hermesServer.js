// @flow

import { Server, Socket } from "socket.io";
import ss from "socket.io-stream";
import http from "http";

let io = null;
const procedures = {};

function handleInvoke(methodName, args, reply) {
  console.log("got invoke request: ", methodName, " with args: ", args);
  const procedure = procedures[methodName];

  if (!procedure) {
    throw new Error(`no such procedure: ${methodName}`);
  }

  const result = procedure(args);

  if (typeof reply === "function") {
    if (result.then) {
      result.then((data: any) => reply(data));
    } else {
      reply(result);
    }
  }
}

let clients = 0;
function handleConnection(socket: Socket) {
  clients += 1;
  console.log("client connected. connected: ", clients);
  ss(socket).on("invoke", handleInvoke);
}

function handleDisconnect(socket: Socket) {
  clients -= 1;

  console.log("client disconnected");
}

function start() {
  return new Promise(resolve => {
    const server = http.createServer();

    io = new Server(server, {
      cors: {
        origin: "http://127.0.0.1:8080",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", handleConnection);
    io.on("disconnect", handleDisconnect);

    server.listen(0, "127.0.0.1", () => {
      resolve(server.address());
    });
  });
}

function registerProcedure(methodName: string, procedureHandler: () => any) {
  procedures[methodName] = procedureHandler;
}

function createStream(options) {
  return ss.createStream(options);
}

export const hermes = {
  registerProcedure,
  createStream,
  start,
};
