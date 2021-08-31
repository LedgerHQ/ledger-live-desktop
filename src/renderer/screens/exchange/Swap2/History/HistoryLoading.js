// @flow
import React from "react";
import Box from "~/renderer/components/Box/Box";
import BigSpinner from "~/renderer/components/BigSpinner";

const HistoryLoading = () => (
  <Box flex={1} alignItems="center" justifyContent="center">
    <BigSpinner size={75} />
  </Box>
);

export default HistoryLoading;
