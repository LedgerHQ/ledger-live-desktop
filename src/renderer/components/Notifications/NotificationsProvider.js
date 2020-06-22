// @flow

import React, { useState, useCallback } from "react";

type Props = {
  children: React$Node,
};

export const NotificationsContext = React.createContext<any>();
export type NotificationType = {
  id: string,
  text: string,
  duration?: number,
  callback?: () => void,
};

const NotificationsProvider = ({ children }: Props) => {
  const [items, setItems] = useState([] /* initial notifications */);
  const dismiss = useCallback(id => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  }, []);
  const add = useCallback(
    notification => setItems(currentItems => [...currentItems, notification]),
    [],
  );
  const value = {
    items,
    dismiss,
    add,
  };
  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

export default NotificationsProvider;
