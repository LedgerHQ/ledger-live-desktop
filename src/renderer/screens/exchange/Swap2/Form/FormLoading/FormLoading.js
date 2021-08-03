// @flow

import React from "react";
import Box from "~/renderer/components/Box";
import BigSpinner from "~/renderer/components/BigSpinner";

import Track from "~/renderer/analytics/Track";

const FormLoading = () => (
  <Box justifyContent="center" alignItems="center">
    <Track onMount event="LoadingProviders" />
    <BigSpinner size={75} />
  </Box>
);

export default FormLoading;
