import React from "react";
import HistoryV1 from "../../swap/History";

/*
 ** As History screen doesn't have a specific v2 yet, this component
 ** only import and return v1 of the history screen.
 ** For the moment, UI is broken and need to be fixed. I wait to discuss
 ** with the design team before fixing it.
 */
const History = () => <HistoryV1 />;

export default History;
