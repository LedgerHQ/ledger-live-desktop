// @flow
import { memo, useEffect } from "react";
import { page } from "./segment";
import { useLocation, useHistory } from "react-router-dom";

function TrackPage({ category, name, ...properties }: { category: string, name?: string }) {
  const location = useLocation();
  const history = useHistory();
  const { state, pathname } = location || {};
  const { source } = state || {};
  useEffect(() => {
    page(category, name, { ...properties, ...(source ? { source } : {}) });
    // reset source router state param once it has been tracked to not repeat it from further unrelated navigation
    history.replace({ pathname, state: { ...state, source: undefined } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default memo<{ category: string, name?: string }>(TrackPage);
