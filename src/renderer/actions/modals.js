// @flow
import { createAction } from "redux-actions";

export const openModal = createAction("MODAL_OPEN", (name, data) => ({ name, data }));
export const closeModal = createAction("MODAL_CLOSE", name => ({ name }));
export const closeAllModal = createAction("MODAL_CLOSE_ALL");
export const setDataModal = createAction("MODAL_SET_DATA", (name, data) => ({ name, data }));
