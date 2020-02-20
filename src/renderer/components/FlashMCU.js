// @flow

import React from "react";
import styled from "styled-components";
import { withTranslation, Trans } from "react-i18next";
import type { DeviceModelId } from "@ledgerhq/devices";
import { bootloader } from "~/config/nontranslatables";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Interactions from "~/renderer/icons/device/interactions";

const Bullet = styled.span`
  font-weight: 600;
  color: ${p => p.theme.colors.palette.text.shade100};
`;

const Separator = styled(Box).attrs(() => ({
  color: "palette.divider",
}))`
  height: 1px;
  width: 100%;
  background-color: currentColor;
`;

type Props = {
  deviceModelId?: DeviceModelId,
};

const FlashMCUNanosLocal = ({ deviceModelId }: Props) => (
  <>
    <Box mx={7}>
      <Text ff="Inter|Regular" textAlign="center" color="palette.text.shade80">
        <Bullet>{"1. "}</Bullet>
        <Trans i18nKey="manager.modal.mcuFirst" />
      </Text>
      <Box mt={5}>
        <Interactions
          screen="empty"
          wire="disconnecting"
          type={deviceModelId || "nanoS"}
          width={368}
        />
      </Box>
    </Box>
    <Separator my={6} />
    <Box mx={7}>
      <Text ff="Inter|Regular" textAlign="center" color="palette.text.shade80">
        <Bullet>{"2. "}</Bullet>
        <Trans i18nKey="manager.modal.mcuSecond">
          {"Press the left button and hold it while you reconnect the USB cable until the "}
          <Text ff="Inter|SemiBold" color="palette.text.shade100">
            {bootloader}
          </Text>
          {" screen appears"}
        </Trans>
      </Text>
      <Box mt={5}>
        <Interactions
          screen="empty"
          action="left"
          wire="connecting"
          type={deviceModelId || "nanoS"}
          width={368}
        />
      </Box>
    </Box>
  </>
);

const FlashMCUNanos = React.memo(FlashMCUNanosLocal);

const Container = styled(Box)`
  max-width: 50%;
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
`;

const FlashMCUBlueLocal = ({ deviceModelId }: Props) => (
  <>
    <Box mx={7} horizontal>
      <Container px={1}>
        <Text ff="Inter|Regular" textAlign="center" color="palette.text.shade80">
          <Bullet>{"1. "}</Bullet>
          <Trans i18nKey="manager.modal.mcuBlueFirst" />
        </Text>
        <Box mt={5}>
          <Interactions wire="wired" type={deviceModelId || "nanoS"} width={120} />
        </Box>
      </Container>
      <Container>
        <Text ff="Inter|Regular" textAlign="center" color="palette.text.shade80">
          <Bullet>{"2. "}</Bullet>
          <Trans i18nKey="manager.modal.mcuBlueSecond" />
        </Text>
        <Box mt={5}>
          <Interactions
            screen="bootloader"
            wire="wired"
            type={deviceModelId || "nanoS"}
            width={120}
          />
        </Box>
      </Container>
    </Box>
  </>
);

const FlashMCUBlue = React.memo(FlashMCUBlueLocal);

const FlashMCU = (props: Props) =>
  props.deviceModelId === "blue" ? <FlashMCUBlue {...props} /> : <FlashMCUNanos {...props} />;

export default withTranslation()(FlashMCU);
