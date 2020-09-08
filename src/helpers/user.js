// @flow

import { v4 as uuid } from "uuid";
import Prando from "prando";
import get from "lodash/get";

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

export const shouldUpdateYet = (version: string, remoteConfig: any) => {
  const userId = getUserId();
  const rng = new Prando(`${userId}-${version}`);
  const progressiveUpdateIndex = rng.next();

  const threshold = get(remoteConfig.data, ["progressive-update", version, process.platform]);

  if (threshold && progressiveUpdateIndex > threshold) {
    return false;
  }
  return true;
};
