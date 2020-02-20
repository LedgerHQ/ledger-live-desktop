// @flow
import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector, createSelector } from "reselect";
import { modalsStateSelector } from "~/renderer/reducers/modals";
import modals from "~/renderer/modals";

const ModalsLayer = ({ visibleModals }: *) =>
  visibleModals.map(name => {
    const ModalComponent = modals[name];
    if (!ModalComponent) return null;
    return <ModalComponent key={name} />;
  });

const visibleModalsSelector = createSelector(modalsStateSelector, state =>
  Object.keys(modals).filter(name => state[name] && state[name].isOpened),
);

const mapStateToProps = createStructuredSelector({
  visibleModals: visibleModalsSelector,
});

// $FlowFixMe
export default connect(mapStateToProps)(ModalsLayer);
