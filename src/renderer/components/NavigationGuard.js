// @flow
import React, { useState, useCallback, memo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Prompt, useHistory } from "react-router-dom";
import ConfirmModal from "~/renderer/modals/ConfirmModal";

import { setNavigationLock } from "~/renderer/actions/application";

type Props = {
  /** set to tru if navigation should be locked */
  when: boolean,
  /** just lock navigation without prompt modal */
  noModal?: boolean,
  /** callback function on location to filter out block navigation according to this param */
  shouldBlockNavigation?: *,
  /** confirm modal analytics name */
  analyticsName?: string,
};

const NavigationGuard = ({
  when,
  noModal,
  shouldBlockNavigation = () => true,
  analyticsName = "NavigationGuard",
  ...confirmModalProps
}: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [lastLocation, setLastLocation] = useState(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    /** Set redux navigation lock status */
    dispatch(setNavigationLock(when));
    /** force close modal when condition is over */
    if (!when) setModalVisible(false);
    return () => {
      /** Reset redux navigation lock status */
      dispatch(setNavigationLock(false));
    };
  }, [dispatch, when]);

  /** show modal if needed and location to go to on confirm */
  const showModal = useCallback(
    location => {
      setModalVisible(!noModal);
      setLastLocation(location);
    },
    [setModalVisible, setLastLocation, noModal],
  );

  /** close modal on cancel */
  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, [setModalVisible]);

  /** handles blocked location update */
  const handleBlockedNavigation = useCallback(
    nextLocation => {
      if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
        /** if navigation is locked show modal */
        showModal(nextLocation);
        return false;
      }
      /** or proceed navigation */
      dispatch(setNavigationLock(false));
      return true;
    },
    [confirmedNavigation, dispatch, shouldBlockNavigation, showModal],
  );

  /** on confirm closes modal and toggles confirmation redirect */
  const handleConfirmNavigationClick = useCallback(() => {
    dispatch(setNavigationLock(false));
    setModalVisible(false);
    if (lastLocation) {
      setConfirmedNavigation(true);
    }
  }, [dispatch, lastLocation]);

  /** retry redirection once confirmation state changes */
  useEffect(() => {
    if (confirmedNavigation && lastLocation)
      history.push({
        pathname: lastLocation.pathname,
        state: { source: "confirmation navigation guard" },
      });
  }, [confirmedNavigation, lastLocation, history]);

  return (
    <>
      <Prompt when={when} message={handleBlockedNavigation} />
      {when && (
        <ConfirmModal
          {...confirmModalProps}
          analyticsName={analyticsName}
          isOpened={modalVisible}
          onCancel={closeModal}
          onReject={handleConfirmNavigationClick}
          onConfirm={closeModal}
        />
      )}
    </>
  );
};

export default memo<Props>(NavigationGuard);
