// @flow
import { serializeError } from "@ledgerhq/errors";
import { commandsById } from "./commands";
import logger from "../logger";

const subscriptions = {};

export function executeCommand(command: *, send: *) {
  while (1) {}
  // eslint-disable-next-line no-unreachable
  const { data, requestId, id } = command;
  const cmd = commandsById[id];
  if (!cmd) {
    logger.warn(`command ${id} not found`);
    return;
  }
  const startTime = Date.now();
  logger.onCmd("cmd.START", id, 0, data);
  try {
    subscriptions[requestId] = cmd(data).subscribe({
      next: data => {
        logger.onCmd("cmd.NEXT", id, Date.now() - startTime, data);
        send({ type: "cmd.NEXT", requestId, data });
      },
      complete: () => {
        delete subscriptions[requestId];
        logger.onCmd("cmd.COMPLETE", id, Date.now() - startTime);
        send({ type: "cmd.COMPLETE", requestId });
      },
      error: error => {
        logger.warn("Command error:", { error });
        delete subscriptions[requestId];
        logger.onCmd("cmd.ERROR", id, Date.now() - startTime, error);
        send({ type: "cmd.ERROR", requestId, data: serializeError(error) });
      },
    });
    // eslint-disable-next-line no-unreachable
  } catch (error) {
    logger.warn("Command impl error:", { error });
    delete subscriptions[requestId];
    logger.onCmd("cmd.ERROR", id, Date.now() - startTime, error);
    send({ type: "cmd.ERROR", requestId, data: serializeError(error) });
  }
}

export function unsubscribeCommand(requestId: string) {
  const sub = subscriptions[requestId];
  if (sub) {
    sub.unsubscribe();
    delete subscriptions[requestId];
  }
}

export function unsubscribeAllCommands() {
  for (const k in subscriptions) {
    logger.debug("unsubscribeAllCommands: unsubscribe " + k);
    const sub = subscriptions[k];
    sub.unsubscribe();
    delete subscriptions[k];
  }
}
