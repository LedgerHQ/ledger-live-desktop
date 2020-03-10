// @flow
import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import LabelWithExternalIcon from "./LabelWithExternalIcon";

type Props = {
  error: ?Error,
};

const SupportLinkError = ({ error }: Props) => {
  const maybeLink = error ? urls.errors[error.name] : null;
  const onOpen = useCallback(() => {
    maybeLink && openURL(maybeLink);
  }, [maybeLink]);
  if (!maybeLink) return null;
  return (
    <LabelWithExternalIcon
      color="currentColor"
      hoverColor="currentColor"
      style={{ display: "inline-flex", marginLeft: "10px" }}
      onClick={onOpen}
      label={<Trans i18nKey="common.learnMore" />}
    />
  );
};

export default SupportLinkError;
