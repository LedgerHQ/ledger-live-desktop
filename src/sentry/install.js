// @flow
import os from "os";
import pname from "~/logger/pname";
import anonymizer from "~/logger/anonymizer";
/* eslint-disable no-continue */

require("../env");

export default (Sentry: any, shouldSendCallback: () => boolean, userId: string) => {
  console.log(Sentry);
  if (!__SENTRY_URL__) return;
  Sentry.init({
    dsn: __SENTRY_URL__,
    release: __APP_VERSION__,
    environment: __DEV__ ? "development" : "production",
    debug: __DEV__,
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
    sampleRate: __DEV__ ? 1 : 0.01,
    initialScope: {
      tags: {
        git_commit: __GIT_REVISION__,
        osType: os.type(),
        osRelease: os.release(),
      },
      user: {
        ip_address: null,
        id: userId,
      },
    },

    // From the documentation, we should be able to do something like that
    // to customise the Breadcrumbs settings, however I cannot get Integrations
    // from the Sentry object ¯\_(ツ)_/¯
    //
    // integrations: [new Sentry.Integrations.Breadcrumbs({ console: false })]

    // Previous config using Raven.js
    //
    // autoBreadcrumbs: {
    //   xhr: false, // it is track anonymously from logger
    //   console: false, // we don't track because not anonymized
    //   dom: false, // user interactions like clicks. it's too cryptic to be exploitable.
    //   location: false, // we don't really need location change because we use trackpage
    //   sentry: true,
    // },

    integrations: function(integrations) {
      // integrations will be all default integrations
      return integrations.filter(function(integration) {
        return integration.name !== "Breadcrumbs";
      });
    },

    beforeSend(data: any, hint: any) {
      console.log("before-send", { data, hint });
      if (!shouldSendCallback()) return null;

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

    beforeBreadcrumb(data: any, hint: any) {
      console.log("before-breadcrumbs", { data, hint });
    },
  });

  Sentry.withScope(scope => scope.setExtra("process", pname));
};
