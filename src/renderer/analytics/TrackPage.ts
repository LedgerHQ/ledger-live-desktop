import { memo, useEffect } from "react";
import { page } from "./segment";

let source: string | undefined;

export const setTrackingSource = (s?: string) => {
  source = s;
};

type TrackPageProps = { category: string, name?: string } & Record<string, string>;

function TrackPage({ category, name, ...properties }: TrackPageProps) {
  useEffect(() => {
    page(category, name ?? null, { ...properties, ...(source ? { source } : {}) });
    // reset source param once it has been tracked to not repeat it from further unrelated navigation
    source = undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default memo<TrackPageProps>(TrackPage);
