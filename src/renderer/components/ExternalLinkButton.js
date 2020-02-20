// @flow

import React from "react";
import { openURL } from "~/renderer/linking";
import Button from "~/renderer/components/Button";
import type { Props as ButtonProps } from "~/renderer/components/Button";

export function ExternalLinkButton({
  label,
  url,
  ...props
}: {
  ...ButtonProps,
  label: React$Node,
  url: string,
}) {
  return (
    <Button onClick={() => openURL(url)} {...props}>
      {label}
    </Button>
  );
}

export default ExternalLinkButton;
