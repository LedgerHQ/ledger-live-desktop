// @flow
import os from "os";
import pname from "./../logger/pname";
import anonymizer from "./../logger/anonymizer";
/* eslint-disable no-continue */

require("../env");

export default (Raven: any, shouldSendCallback: () => boolean, userId: string) => {
  if (!__SENTRY_URL__) return;
  let r = Raven.config(__SENTRY_URL__, {
    captureUnhandledRejections: true,
    allowSecretKey: true,
    release: __APP_VERSION__,
    tags: {
      git_commit: __GIT_REVISION__,
      osType: os.type(),
      osRelease: os.release(),
    },
    sampleRate: 0.01,
    environment: __DEV__ ? "development" : "production",
    shouldSendCallback,
    ignoreErrors: [
      "failed with status code",
      "status code 404",
      "timeout",
      "socket hang up",
      "getaddrinfo",
      "could not read from HID device",
      "ENOTFOUND",
      "ETIMEDOUT",
      "ECONNRESET",
      "ENETUNREACH",
      "request timed out",
      "NetworkDown",
      "ERR_CONNECTION_TIMED_OUT",
    ],
    autoBreadcrumbs: {
      xhr: false, // it is track anonymously from logger
      console: false, // we don't track because not anonymized
      dom: false, // user interactions like clicks. it's too cryptic to be exploitable.
      location: false, // we don't really need location change because we use trackpage
      sentry: true,
    },
    extra: {
      process: pname,
    },
    dataCallback: (data: mixed) => {
      // We are mutating the data to anonymize everything.

      if (typeof data !== "object" || !data) return data;

      // $FlowFixMe
      delete data.server_name; // hides the user machine name

      if (typeof data.request === "object" && data.request) {
        const { request } = data;
        if (typeof request.url === "string") {
          // $FlowFixMe not sure why
          request.url = anonymizer.appURI(request.url);
        }
      }

      anonymizer.filepathRecursiveReplacer(data);

      console.log("Sentry=>", data); // eslint-disable-line
      return data;
    },
  });
  const user = {
    ip_address: null,
    id: userId,
  };
  if (r.setUserContext) {
    r = r.setUserContext(user);
  } else if (r.setContext) {
    r = r.setContext({ user });
  }
  r.install();
};
