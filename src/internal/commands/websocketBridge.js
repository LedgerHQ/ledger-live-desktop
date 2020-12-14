// @flow
import { Observable } from "rxjs";
import { log, listen } from "@ledgerhq/logs";
import { open } from "@ledgerhq/live-common/lib/hw";
import WebSocket from "ws";

type Input = {
  origin: ?string,
  deviceId: string,
};
type Result = { log: string };

const cmd = ({ origin, deviceId }: Input): Observable<Result> =>
  Observable.create(o => {
    const unsubLogs = listen(l => {
      if (l.type === "proxy" && l.message) {
        o.next({ log: l.message });
      }
    });

    const port = "8435";
    const ws = new WebSocket.Server({ port });

    let wsIndex = 0;
    let wsBusyIndex = 0;

    ws.on("connection", (ws, connection) => {
      if (origin && new URL(connection.headers.origin).host !== origin) {
        o.next({ log: "invalid origin " + connection.headers.origin });
        ws.close();
        return;
      }

      const index = ++wsIndex;
      try {
        let transport;
        let transportP;
        let destroyed = false;

        const onClose = async () => {
          if (destroyed) return;
          destroyed = true;
          if (wsBusyIndex === index) {
            log("proxy", `WS(${index}): close`);
            if (transportP) {
              await transportP.then(
                t => t.close(),
                () => {},
              );
              o.complete();
            }
            wsBusyIndex = 0;
          }
        };

        ws.on("close", onClose);

        ws.on("message", async apduHex => {
          if (destroyed) return;

          if (apduHex === "open") {
            if (wsBusyIndex) {
              ws.send(
                JSON.stringify({
                  error: "WebSocket is busy (previous session not closed)",
                }),
              );
              ws.close();
              destroyed = true;
              return;
            }
            transportP = open(deviceId);
            wsBusyIndex = index;

            log("proxy", `WS(${index}): opening...`);
            try {
              transport = await transportP;
              transport.on("disconnect", () => ws.close());
              log("proxy", `WS(${index}): opened!`);
              ws.send(JSON.stringify({ type: "opened" }));
            } catch (e) {
              log("proxy", `WS(${index}): open failed! ${e}`);
              ws.send(
                JSON.stringify({
                  error: e.message,
                }),
              );
              ws.close();
            }
            return;
          }

          if (wsBusyIndex !== index) {
            console.warn("ignoring message because busy transport");
            return;
          }

          if (!transport) {
            console.warn("received message before device was opened");
            return;
          }
          try {
            const res = await transport.exchange(Buffer.from(apduHex, "hex"));
            log("proxy", `WS(${index}): ${apduHex} => ${res.toString("hex")}`);
            if (destroyed) return;
            ws.send(JSON.stringify({ type: "response", data: res.toString("hex") }));
          } catch (e) {
            log("proxy", `WS(${index}): ${apduHex} =>`, e);
            if (destroyed) return;
            ws.send(JSON.stringify({ type: "error", error: e.message }));
            if (e.name === "RecordStoreWrongAPDU") {
              console.error(e.message);
              process.exit(1);
            }
          }
        });
      } catch (e) {
        ws.close();
      }
    });

    ws.on("error", e => {
      log("proxy", "Error: " + e.message);
      o.error(e);
    });

    ws.on("listening", () => {
      log("proxy", "Proxy is running");
    });

    return () => {
      unsubLogs();
      ws.close();
    };
  });

export default cmd;
