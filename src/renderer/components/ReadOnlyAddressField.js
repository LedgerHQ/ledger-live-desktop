// @flow
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Trans } from "react-i18next";
import { clipboard } from "electron";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import IconCopy from "~/renderer/icons/Copy";

const LINE_MINLENGTH = 5; // Minimum of chars for the last line (if multiline)

const Address = styled(Box).attrs(() => ({
  bg: "palette.background.default",
  borderRadius: 1,
  color: "palette.text.shade100",
  ff: "Inter",
  fontSize: 4,
  px: 4,
  py: 3,
  relative: true,
}))`
  border: ${p => `1px solid ${p.theme.colors.palette.divider}`};
  ${p =>
    p.allowCopy
      ? `border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`
      : ""}

  text-align: center;
  flex: 1;
`;

const AddressWrapper = styled.span`
  cursor: text;
  user-select: text;
  word-break: break-all;

  span:last-child {
    word-break: keep-all;
  }
`;

const CopyFeedback = styled(Box).attrs(() => ({
  sticky: true,
  bg: "palette.background.default",
  alignItems: "center",
  justifyContent: "center",
}))`
  border-left: 1px solid ${p => p.theme.colors.palette.divider};
`;

const ClipboardSuspicious = styled.div`
  font-family: Inter;
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  align-self: center;
  color: ${p => p.theme.colors.alertRed};
`;

const CopyBtn = styled(Box).attrs(() => ({
  bg: "palette.background.paper",
  color: "palette.text.shade100",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 1,
  px: 2,
}))`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border: ${p => `1px solid ${p.theme.colors.palette.divider}`};

  &:hover {
    opacity: 0.8;
  }
`;

type Props = {
  address: string,
  allowCopy?: boolean,
};

function ReadOnlyAddressField({ address, allowCopy = true }: Props) {
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [clibboardChanged, setClipboardChanged] = useState(false);

  const copyTimeout = useRef();

  const onCopy = useCallback(() => {
    clipboard.writeText(address);
    setCopyFeedback(true);
    clearTimeout(copyTimeout.current);
    setTimeout(() => {
      const copiedAddress = clipboard.readText();
      if (copiedAddress !== address) {
        setClipboardChanged(true);
      }
    }, 300);
    copyTimeout.current = setTimeout(() => setCopyFeedback(false), 1e3);
  }, [address]);

  useEffect(() => {
    return () => {
      clearTimeout(copyTimeout.current);
    };
  }, []);

  // Split address into multiple segments - last can't breakline.
  const addressSegments = [
    address.substr(0, address.length - LINE_MINLENGTH),
    address.substr(-LINE_MINLENGTH),
  ];

  return (
    <Box vertical>
      {clibboardChanged ? (
        <ClipboardSuspicious>
          <Trans i18nKey="common.addressCopiedSuspicious" />
        </ClipboardSuspicious>
      ) : null}
      <Box horizontal alignItems="stretch">
        <Address allowCopy={allowCopy}>
          {!copyFeedback ? null : (
            <CopyFeedback>
              <Trans i18nKey="common.addressCopied" />
            </CopyFeedback>
          )}
          <AddressWrapper>
            <span>{addressSegments[0]}</span>
            <span>{addressSegments[1]}</span>
          </AddressWrapper>
        </Address>
        {allowCopy ? (
          <CopyBtn onClick={onCopy}>
            <IconCopy size={16} />
          </CopyBtn>
        ) : null}
      </Box>
    </Box>
  );
}

export default ReadOnlyAddressField;
