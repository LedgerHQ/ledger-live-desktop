// @flow
import React, { useState } from "react";
import useInterval from "~/renderer/hooks/useInterval";
import moment from "moment";

const CountdownTimer = ({
  end,
  format = "HH:mm:ss",
  callback,
}: {
  end: Date,
  format?: string,
  callback: Function,
}) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [finished, setFinished] = useState(false);

  useInterval(() => {
    if (!end || finished) {
      return;
    }

    const seconds = end - new Date();
    setTimeLeft(moment.utc(seconds).format(format));
    if (seconds <= 0 && callback) {
      setFinished(true);
      callback();
    }
  }, 1000); // NB maybe generalize to show in minutes/milliseconds

  return <span>{timeLeft}</span>;
};

export default CountdownTimer;
