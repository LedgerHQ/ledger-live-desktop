// @flow
import React, { useEffect } from "react";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import IconCross from "~/renderer/icons/Cross";
import TimeBasedProgressBar from "./TimeBasedProgressBar";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { animated, useTransition } from "react-spring";
import { delay } from "@ledgerhq/live-common/lib/promise";

const Content: ThemedComponent<{}> = styled.div`
  color: ${p => p.theme.colors.palette.background.paper};
  opacity: 0.9;
  padding: 12px 22px;
  display: grid;
  grid-template-columns: "1fr auto";
  grid-gap: 10px;
`;

const Wrapper: ThemedComponent<{ onClick?: () => void }> = styled(animated.div)`
  cursor: ${p => (p.onClick ? "pointer" : "auto")};
  background-color: ${p => p.theme.colors.palette.text.shade100};
  position: relative;
  overflow: hidden;
  height: auto;
  border-radius: 3px;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 250px;
`;

const DismissWrapper: ThemedComponent<{}> = styled.div`
  position: absolute;
  cursor: pointer;
  color: ${p => p.theme.colors.palette.background.paper};
  top: 3px;
  right: 3px;
`;

const Notification = ({
  duration,
  onDismiss,
  callback,
  text,
  id,
}: {
  duration?: number,
  onDismiss: (id: string) => void,
  callback: any,
  text: string,
  id: string,
}) => {
  const transitions = useTransition(1, null, {
    from: {
      height: 0,
      opacity: 0,
    },
    enter: {
      height: "auto",
      opacity: 1,
    },
    leave: {
      height: 0,
      opacity: 0,
    },
    config: { duration: 1000, tension: 125, friction: 20, precision: 0.1 },
  });

  useEffect(() => {
    async function scheduledDismiss(duration) {
      await delay(duration);
      onDismiss(id);
    }
    if (duration) {
      scheduledDismiss(duration);
    }
  }, [duration, id, onDismiss]);

  return transitions.map(({ key, item, props }) => (
    <Wrapper
      key={key}
      style={props}
      onClick={() => {
        callback();
        onDismiss(id);
      }}
    >
      <Content>
        <Text ff="Inter|Regular" fontSize={4}>
          {text}
        </Text>
      </Content>
      {duration ? (
        <TimeBasedProgressBar duration={duration} />
      ) : (
        <DismissWrapper onClick={() => onDismiss(id)}>
          <IconCross size={12} />
        </DismissWrapper>
      )}
    </Wrapper>
  ));
};

export default Notification;
