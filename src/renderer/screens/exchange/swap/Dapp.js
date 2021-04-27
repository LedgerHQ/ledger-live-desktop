// @flow
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { Card } from "~/renderer/components/Box";
import WebPlatformPlayer from "~/renderer/components/WebPlatformPlayer";

type Props = {
  match: {
    params: {
      platform: string,
    },
    isExact: boolean,
    path: string,
    url: string,
  },
};

export default function SwapDapp({ match }: Props) {
  const history = useHistory();
  const { platform } = match.params;

  const handleClose = useCallback(() => history.push(`/swap`), [history]);

  return (
    <Card grow style={{ overflow: "hidden" }}>
      <WebPlatformPlayer platform={platform || ""} onClose={handleClose} />
    </Card>
  );
}
