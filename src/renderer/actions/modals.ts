import { createAction } from "redux-actions";

export const openModal = createAction<{
    name: string;
    data: any;
}, string, Object | undefined>("MODAL_OPEN", (name: string, data?: any) => ({ name, data }));
export const closeModal = createAction("MODAL_CLOSE", (name: string) => ({ name }));
export const closeAllModal = createAction("MODAL_CLOSE_ALL");
export const setDataModal = createAction("MODAL_SET_DATA", (name: string, data: any) => ({ name, data }));
