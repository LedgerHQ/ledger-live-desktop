// @flow

import type { BigNumber } from "bignumber.js";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { decodeURIScheme } from "@ledgerhq/live-common/lib/currencies";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";

import { radii } from "~/renderer/styles/theme";

import QRCodeCameraPickerCanvas from "~/renderer/components/QRCodeCameraPickerCanvas";
import Box from "~/renderer/components/Box";
import Input from "~/renderer/components/Input";
import { track } from "~/renderer/analytics/segment";

import IconQrCode from "~/renderer/icons/QrCode";
import { useOnSetOverlays } from "~/renderer/components/ProductTour/hooks";

const Right = styled(Box).attrs(() => ({
  bg: "palette.background.default",
  px: 3,
  alignItems: "center",
  justifyContent: "center",
}))`
  border-top-right-radius: ${radii[1]}px;
  border-bottom-right-radius: ${radii[1]}px;
  border-left: 1px solid ${p => p.theme.colors.palette.divider};
`;

const WrapperQrCode = styled(Box)`
  margin-bottom: 10px;
  position: absolute;
  right: 0;
  bottom: 100%;
  z-index: 3;
`;

const BackgroundLayer = styled(Box)`
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
`;

type Props = {
  value: string,
  // return false if it can't be changed (invalid info)
  onChange: (string, ?{ amount?: BigNumber, currency?: CryptoCurrency }) => Promise<?boolean>,
  withQrCode: boolean,
};

const RecipientAddress = ({ onChange, withQrCode, value = "", ...rest }: Props) => {
  const [qrReaderOpened, setQrReaderOpened] = useState(false);

  const preOnChange = useCallback(text => onChange((text && text.replace(/\s/g, "")) || ""), [
    onChange,
  ]);
  const onShowQRCodeOverlay = useOnSetOverlays({
    selector: "#send-qrcode-scan",
    i18nKey: "productTour.flows.send.overlays.qrcode",
    config: { bottom: true },
  });
  const onHideQRCodeOverlay = useOnSetOverlays({
    selector: "#send-source",
    i18nKey: "productTour.flows.send.overlays.source",
    config: { bottom: true, right: true, disableScroll: true, withFeedback: true, padding: 10 },
  });

  const handleClickQrCode = useCallback(() => {
    setQrReaderOpened(!qrReaderOpened);
    if (!qrReaderOpened) {
      onShowQRCodeOverlay();
      track("Send Flow QR Code Opened");
    } else {
      onHideQRCodeOverlay();
      track("Send Flow QR Code Closed");
    }
  }, [onHideQRCodeOverlay, onShowQRCodeOverlay, qrReaderOpened]);

  const handleOnPick = useCallback(
    (code: string) => {
      const { address, ...rest } = decodeURIScheme(code);
      const result = { ...rest, fromQRCode: true };

      if (onChange(address, result) !== false) {
        setQrReaderOpened(false);
      }
    },
    [onChange],
  );

  return (
    <Box relative justifyContent="center">
      <Input
        {...rest}
        spellCheck="false"
        value={value}
        onChange={preOnChange}
        renderRight={
          withQrCode ? (
            <Right onClick={handleClickQrCode}>
              <IconQrCode size={16} />
              {qrReaderOpened && (
                <>
                  <BackgroundLayer />
                  <WrapperQrCode id={"send-qrcode-scan"}>
                    <QRCodeCameraPickerCanvas onPick={handleOnPick} />
                  </WrapperQrCode>
                </>
              )}
            </Right>
          ) : null
        }
      />
    </Box>
  );
};

export default RecipientAddress;
