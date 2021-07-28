// @flow

import React from "react";
import Box from "~/renderer/components/Box";
import BigSpinner from "~/renderer/components/BigSpinner";

const FormLoading = () => (
  <Box justifyContent="center" alignItems="center">
    <BigSpinner size={75} />
  </Box>
);

export default FormLoading;
