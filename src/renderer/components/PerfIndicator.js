// @flow
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { command } from "~/renderer/commands";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import useInterval from "~/renderer/hooks/useInterval";

const Indicator: ThemedComponent<{}> = styled.div`
  opacity: 0.8;
  border-radius: 3px;
  background-color: ${p => p.theme.colors.palette.background.paper};
  position: fixed;
  font-size: 10px;
  padding: 3px 6px;
  bottom: 0;
  left: 0;
  z-index: 999;
  pointer-events: none;
`;

const PerfIndicator = () => {
  const [opsPerSecond, setOpsPerSecond] = useState(0);
  const count = useRef(0);
  const finished = useRef(false);

  useEffect(() => {
    let sub;
    const loop = () => {
      ++count.current;
      if (finished.current) return;

      sub = command("ping")().subscribe({
        complete: loop,
      });
    };

    loop();

    return () => {
      if (sub) sub.unsubscribe();
      finished.current = true;
    };
  }, []);

  useInterval(() => {
    setOpsPerSecond(count.current);
    count.current = 0;
  }, 1000);

  return (
    <Indicator>
      {opsPerSecond}
      {" ops/s"}
    </Indicator>
  );
};

export default PerfIndicator;
