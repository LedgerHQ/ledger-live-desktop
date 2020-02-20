// @flow
import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import LinkWithExternalIcon from "./LinkWithExternalIcon";

type Props = {
  error: ?Error,
};

const SupportLinkError = ({ error }: Props) => {
  const maybeLink = error ? urls.errors[error.name] : null;
  const onOpen = useCallback(() => {
    maybeLink && openURL(maybeLink);
  }, [maybeLink]);
  console.log(maybeLink);
  if (!maybeLink) return null;
  return (
    <LinkWithExternalIcon
      style={{ display: "inline-flex", marginLeft: "10px" }}
      onClick={onOpen}
      label={<Trans i18nKey="common.learnMore" />}
    />
  );
};

export default SupportLinkError;
