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
import { useTranslation } from "react-i18next";
import InfoCircle from "~/renderer/icons/InfoCircle";
import Box from "~/renderer/components/Box";

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
  display: flex;
  top: 17px;
  right: 17px;
`;

const IconContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  margin-right: 15px;
`;

const TextContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const icons = {
  warning: {
    defaultIconColor: "orange",
    Icon: TriangleWarning,
  },
  info: {
    defaultIconColor: "wallet",
    Icon: InfoCircle,
  },
};

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
  const { t } = useTranslation();
  const { Icon, defaultIconColor } = icons[icon];

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
      onClick={event => {
        callback();
        onDismiss(id);
        event.stopPropagation();
      }}
    >
      <Content>
        <IconContainer color={defaultIconColor}>
          <Icon size={19} />
        </IconContainer>
        <TextContainer>
          <Text
            ff="Inter|Bold"
            fontSize="8px"
            lineHeight="9.68px"
            uppercase
            letterSpacing="0.2em"
            style={{ opacity: 0.4 }}
          >
            {t(`toastOverlay.toastType.${type}`)}
          </Text>
          <Text mt="2px" ff="Inter|SemiBold" fontSize="14px" lineHeight="16.94px">
            {title}
          </Text>
          <Text
            mt="10px"
            ff="Inter|Regular"
            fontSize="13px"
            lineHeight="18px"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              opacity: 0.5,
            }}
          >
            {text}
          </Text>
        </TextContainer>
      </Content>
      {duration ? (
        <TimeBasedProgressBar duration={duration} />
      ) : (
        <DismissWrapper
          onClick={event => {
            onDismiss(id);
            event.stopPropagation();
          }}
        >
          <IconCross size={12} />
        </DismissWrapper>
      )}
    </Wrapper>
  ));
}
