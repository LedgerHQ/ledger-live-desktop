/* eslint-disable no-unused-expressions */
!(function() {
  const analytics = (window.analytics = window.analytics || []);
  if (!analytics.initialize)
    if (analytics.invoked)
      window.console && console.error && console.error("Segment snippet included twice.");
    else {
      analytics.invoked = !0;
      analytics.methods = [
        "trackSubmit",
        "trackClick",
        "trackLink",
        "trackForm",
        "pageview",
        "identify",
        "reset",
        "group",
        "track",
        "ready",
        "alias",
        "debug",
        "page",
        "once",
        "off",
        "on",
      ];
      analytics.factory = function(t) {
        return function() {
          const e = Array.prototype.slice.call(arguments);
          e.unshift(t);
          analytics.push(e);
          return analytics;
        };
      };
      for (let t = 0; t < analytics.methods.length; t++) {
        const e = analytics.methods[t];
        analytics[e] = analytics.factory(e);
      }
      analytics.SNIPPET_VERSION = "4.1.0";
    }
})();
