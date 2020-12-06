// @flow

import React, { useContext } from "react";
import ProductTourContext from "./ProductTourContext";
import Dashboard from "./Dashboard";
import Landing from "./Landing";

// NB ProductTour is used as a content replacement for the whole app main content when triggered.
const ProductTour = () => {
  const { state } = useContext(ProductTourContext);
  const { context } = state;
  const { activeFlow } = context;
  return activeFlow ? <Landing /> : <Dashboard />;
};

export default ProductTour;
