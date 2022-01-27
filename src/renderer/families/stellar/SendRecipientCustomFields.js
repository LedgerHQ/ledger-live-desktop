// @flow
import React from "react";
import { withTranslation } from "react-i18next";
import Box from "~/renderer/components/Box";
import ErrorBanner from "~/renderer/components/ErrorBanner";

const Root = (props: *) => {
  const { errors } = props.status;

  if (errors?.nativeBalance) {
    return (
      <Box flow={1}>
        <ErrorBanner error={errors.nativeBalance} />
      </Box>
    );
  }

  return null;
};

export default {
  component: withTranslation()(Root),
  fields: [],
};
