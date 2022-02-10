// CastButton component
import React, { useCallback } from "react";
import { useCast } from "react-chromecast";

export default function CastButton() {
  const cast = useCast({
    initialize_media_player: "DEFAULT_MEDIA_RECEIVER_APP_ID",
    auto_initialize: true,
  });
  const handleClick = useCallback(async () => {
    if (cast.castReceiver) {
      await cast.handleConnection();
    }
  }, [cast.castReceiver, cast.handleConnection]);
  return <button onClick={handleClick}>castIcon</button>;
}
