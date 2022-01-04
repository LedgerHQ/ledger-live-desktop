// @flow
import React, { useState } from "react";
import useInterval from "~/renderer/hooks/useInterval";
import Text from "~/renderer/components/Text";
import moment from "moment";

const CountdownTimer = ({
  end,
  format = "mm:ss",
  callback,
}: {
  end: Date,
  format?: string,
  callback: Function,
}) => {
  const [timeLeft, setTimeLeft] = useState(moment.utc(end - new Date()).format(format));
  const [finished, setFinished] = useState(false);

  useInterval(() => {
    if (!end || finished || process.env.PLAYWRIGHT_RUN_DISABLE_COUNTDOWN_TIMERS) {
      return;
    }

    const seconds = end - new Date();

    if (seconds <= 1 && callback) {
      setFinished(true);
      callback();
    } else {
      setTimeLeft(moment.utc(seconds).format(format));
    }
  }, 1000);

  return (
    <Text ff="Inter|Regular" fontSize={2} color={"palette.text.shade60"}>
      {timeLeft}
    </Text>
  );
};

export default CountdownTimer;
