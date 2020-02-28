// @flow

import uuid from "uuid/v4";

import { setKey, getKey } from "~/renderer/storage";

// a user is an anonymous way to identify a same instance of the app

// only used by analytics. DEPRECATED (will will later switch to localStorage)
export default async () => {
  let user = await getKey("app", "user");
  if (!user) {
    user = { id: uuid() };
    setKey("app", "user", user);
  }
  return user;
};

export const getUserId = () => {
  if (typeof window === "object") {
    const { localStorage } = window;
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = uuid();
      localStorage.setItem("userId", userId);
      return userId;
    }
    return localStorage.getItem("userId");
  }
  throw new Error("user is only to be called from renderer");
};
