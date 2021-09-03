import React from "react";
import Input, { InputProps } from "@components/Form/Input/BaseInput";
import FlexBox from "@ui/components/Layout/Flex";
import QrCodeMedium from "@ui/assets/icons/QrCodeMedium";
import styled from "styled-components";

const QrCodeButton = styled.button.attrs(p => ({
  color: p.theme.colors.palette.v2.text.secondary,
}))`
  background-color: ${p => p.theme.colors.palette.v2.text.default};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border-width: 0;
`;

const Icon = styled(QrCodeMedium).attrs(p => ({
  color: p.theme.colors.palette.v2.text.contrast,
}))``;

export default function QrCodeInput({
  onQrCodeClick,
  ...inputProps
}: InputProps & { onQrCodeClick?: (e: React.FormEvent<HTMLButtonElement>) => void }): JSX.Element {
  return (
    <Input
      {...inputProps}
      renderRight={
        <FlexBox alignItems={"center"} justifyContent={"center"} pr={"8px"}>
          <QrCodeButton onClick={onQrCodeClick}>
            <Icon size={"20px"} />
          </QrCodeButton>
        </FlexBox>
      }
    />
  );
}
