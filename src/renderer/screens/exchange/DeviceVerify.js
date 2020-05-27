// @flow

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isModalOpened } from "~/renderer/reducers/modals";
import { openModal, closeModal } from "~/renderer/actions/modals";

const RequiresDeviceMatchesAccount = ({ account, onResult, onCancel }: { account: Account }) => {
  const dispatch = useDispatch();
  const opened = useSelector(s => isModalOpened(s, "MODAL_EXCHANGE_CRYPTO_DEVICE"));
  const openedRef = useRef(opened);
  useEffect(() => {
    openedRef.current = opened;
  }, [opened]);

  useEffect(() => {
    if (!openedRef.current) {
      dispatch(openModal("MODAL_EXCHANGE_CRYPTO_DEVICE", { account, onResult, onCancel }));
    }
    return () => {
      if (openedRef.current) {
        dispatch(closeModal("MODAL_EXCHANGE_CRYPTO_DEVICE"));
      }
    };
  }, [account, dispatch]);

  return null;
};

export default RequiresDeviceMatchesAccount;
