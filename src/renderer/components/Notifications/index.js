// @flow

import React, { useContext } from "react";
import styled from "styled-components";
import Notification from "~/renderer/components/Notifications/Notification";
import { NotificationsContext } from "~/renderer/components/Notifications/NotificationsProvider";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const Wrapper: ThemedComponent<{}> = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 8px;
  padding-bottom: 0;
  & *:nth-child(n + 6) {
    display: none;
  }
`;

const Notifications = () => {
  const { items, dismiss } = useContext(NotificationsContext);
  return (
    <Wrapper>
      {items.map(({ duration, id, text, callback }) => (
        <Notification
          id={id}
          callback={callback}
          onDismiss={dismiss}
          duration={duration}
          key={id}
          text={text}
        />
      ))}
    </Wrapper>
  );
};

export default Notifications;
