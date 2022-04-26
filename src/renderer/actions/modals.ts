import { Action, createAction } from "redux-actions";

export const openModal = createAction("MODAL_OPEN", (name: string, data?: any) => ({
  name,
  data,
})) as (
  name: string,
  data?: any,
) => Action<{
  name: string;
  data?: any;
}>;

export const closeModal = createAction("MODAL_CLOSE", (name: string) => ({ name }));
export const closeAllModal = createAction("MODAL_CLOSE_ALL");
export const setDataModal = createAction("MODAL_SET_DATA", (name: string, data: any) => ({
  name,
  data,
}));
