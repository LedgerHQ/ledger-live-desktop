// @flow

import React, { useEffect } from "react";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import IconCross from "~/renderer/icons/Cross";
import { TimeBasedProgressBar } from "./TimeBasedProgressBar";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { animated, useTransition } from "react-spring";
import { delay } from "@ledgerhq/live-common/lib/promise";
import TriangleWarning from "~/renderer/icons/TriangleWarning";

const Content: ThemedComponent<{}> = styled.div`
  color: ${p => p.theme.colors.palette.background.paper};
  padding: 16px;
  display: flex;
  flex-direction: row;
`;

const Wrapper: ThemedComponent<{ onClick?: () => void }> = styled(animated.div)`
  cursor: ${p => (p.onClick ? "pointer" : "auto")};
  background-color: ${p => p.theme.colors.palette.text.shade100};
  position: relative;
  overflow: hidden;
  height: auto;
  border-radius: 3px;
  margin: 12px;
  width: 400px;
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.1);
`;

const DismissWrapper: ThemedComponent<{}> = styled.div`
  position: absolute;
  cursor: pointer;
  color: ${p => p.theme.colors.palette.background.paper};
  top: 3px;
  right: 3px;
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 15px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export function Toast({
  duration,
  onDismiss,
  callback,
  type,
  title,
  text,
  icon,
  id,
}: {
  duration?: number,
  onDismiss: (id: string) => void,
  callback: any,
  type: string,
  title: string,
  text: string,
  icon: string,
  id: string,
}) {
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
        <IconContainer>
          <TriangleWarning size={19} />
        </IconContainer>
        <TextContainer>
          <Text ff="Inter|Bold" fontSize="8px" lineHeight="9.68px" uppercase letterSpacing="0.2em">
            {type}
          </Text>
          <Text mt="2px" ff="Inter|SemiBold" fontSize="14px" lineHeight="16.94px">
            {title}
          </Text>
          <Text mt="10px" ff="Inter|Regular" fontSize="13px" lineHeight="18px">
            {text}
          </Text>
        </TextContainer>
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
}
