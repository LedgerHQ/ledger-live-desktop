// @flow
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { USBTroubleshootingIndexSelector } from "~/renderer/reducers/settings";
import { setUSBTroubleshootingIndex } from "~/renderer/actions/settings";
import { setTrackingSource } from "../analytics/TrackPage";

function useUSBTroubleshooting() {
  const lastLocation = useRef(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const USBTroubleshootingIndex = useSelector(USBTroubleshootingIndexSelector);

  useEffect(() => {
    if (!lastLocation) lastLocation.current = location.pathname;
    if (
      USBTroubleshootingIndex !== undefined &&
      USBTroubleshootingIndex !== null &&
      location.pathname !== "/USBTroubleshooting"
    ) {
      if (lastLocation.current === "/USBTroubleshooting") {
        lastLocation.current = location.pathname;
        // We are navigating away from the troubleshooting
        dispatch(setUSBTroubleshootingIndex());
      } else {
        setTrackingSource("USBTroubleshooting");
        lastLocation.current = "/USBTroubleshooting";
        history.push({ pathname: "/USBTroubleshooting", state: { USBTroubleshootingIndex } });
      }
    } else {
      lastLocation.current = location.pathname;
    }
  }, [USBTroubleshootingIndex, dispatch, history, location.pathname]);
}

export default useUSBTroubleshooting;
