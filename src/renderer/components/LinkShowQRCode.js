// @flow

import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import IconQrCode from "~/renderer/icons/QrCode";
import Label from "./Label";
import { rgba } from "~/renderer/styles/helpers";

const Wrapper: ThemedComponent<{}> = styled(Label).attrs(() => ({
  ff: "Inter|SemiBold",
  color: "wallet",
  fontSize: 4,
  alignItems: "center",
}))`
  display: flex;
  cursor: pointer;

  &:hover {
    color: ${p => rgba(p.theme.colors.wallet, 0.9)};
  }

  span {
    text-decoration: underline;
    padding-left: 5px;
  }
`;

type Props = {
  address: string,
  onClick: () => void,
};

export function LinkShowQRCode({ address, onClick }: Props) {
  return (
    <Wrapper onClick={onClick}>
      <IconQrCode size={12} />
      <span>Show QR Code</span>
    </Wrapper>
  );
}

export default LinkShowQRCode;
