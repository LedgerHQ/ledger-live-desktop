// @flow
import { useState, useEffect } from "react";
import type { TransactionStatus } from "@ledgerhq/live-common/lib/types";

// handlesError can tell if the error is displayed inside the spoiler to make it auto open if an error happens
export const useSpoilerForTransaction = (
  status: TransactionStatus,
  handlesError: (key: string, value: Error) => boolean = () => true,
): [boolean, (boolean) => void] => {
  const [spoilerOpened, setSpoilerOpened] = useState(false);
  useEffect(() => {
    if (
      !spoilerOpened &&
      (Object.keys(status.errors).filter(key => handlesError(key, status.errors[key])).length > 0 ||
        Object.keys(status.warnings).filter(key => handlesError(key, status.warnings[key])).length >
          0)
    ) {
      setSpoilerOpened(true);
    }
  }, [spoilerOpened, status, handlesError]);
  return [spoilerOpened, setSpoilerOpened];
};
