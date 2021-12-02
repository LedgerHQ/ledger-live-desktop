// @flow
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { lastSeenDeviceSelector } from "~/renderer/reducers/settings";

import {
  Wrapper,
  Title,
  SubTitle,
  renderLoading,
} from "~/renderer/components/DeviceAction/rendering";
import { Trans } from "react-i18next";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import { useHistory } from "react-router-dom";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { command } from "~/renderer/commands";

import nanoX from "./assets/nanoX.png";
import nanoS from "./assets/nanoS.png";

const NanoX = styled.div`
  background: url(${nanoX}) no-repeat top right;
  width: 332px;
  height: 50px;
  background-size: contain;
`;

const NanoS = styled.div`
  background: url(${nanoS}) no-repeat top right;
  width: 290px;
  height: 50px;
  background-size: contain;
`;

const Disconnected = ({ onTryAgain }: { onTryAgain: boolean => void }) => {
  const lastSeenDevice = useSelector(lastSeenDeviceSelector);
  const [readyToDecide, setReadyToDecide] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);
  const device = useSelector(getCurrentDevice);
  const history = useHistory();

  const onReopenManager = useCallback(() => {
    onTryAgain(false);
  }, [onTryAgain]);

  const onBackToPortfolio = useCallback(() => {
    history.push({ pathname: "/" });
  }, [history]);

  useEffect(() => {
    setTimeout(() => {
      setReadyToDecide(true);
    }, 3000);
  }, []);

  useEffect(() => {
    let sub;
    if (readyToDecide) {
      if (!device) {
        onTryAgain(false); // Device is disconnected
      } else {
        sub = command("getAppAndVersion")(device).subscribe({
          next: appAndVersion => {
            if (["BOLOS", "OLOS\u0000"].includes(appAndVersion?.name)) {
              onTryAgain(false); // Device is in dashboard
            } else {
              setShowSpinner(false);
            }
          },
          error: () => onTryAgain(false), // Fallback if error
        });
      }
    }
    return () => {
      if (sub) sub.unsubscribe();
    };
  }, [readyToDecide, device, onTryAgain]);

  if (showSpinner)
    return <Wrapper>{renderLoading({ modelId: lastSeenDevice?.modelId || "nanoS" })}</Wrapper>;

  return (
    <Wrapper>
      {lastSeenDevice?.modelId === "nanoX" ? <NanoX /> : <NanoS />}
      <Box mt={60}>
        <Title>
          <Trans i18nKey={"manager.disconnected.title"} />
        </Title>
        <SubTitle>
          <Trans i18nKey={"manager.disconnected.subtitle"} />
        </SubTitle>
      </Box>
      <Box flex={0} mt={32}>
        <Button primary onClick={onReopenManager}>
          <Trans i18nKey={"manager.disconnected.ctaReopen"} />
        </Button>
        <Button secondary mt={3} onClick={onBackToPortfolio}>
          <Trans i18nKey={"manager.disconnected.ctaPortfolio"} />
        </Button>
      </Box>
    </Wrapper>
  );
};

export default Disconnected;
