// @flow
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Trans } from "react-i18next";
import { clipboard } from "electron";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import IconCopy from "~/renderer/icons/Copy";

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
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: ${p => `1px solid ${p.theme.colors.palette.divider}`};
  border-right: none;
  cursor: text;
  user-select: text;
  text-align: center;
  flex: 1;
`;

const CopyFeedback = styled(Box).attrs(() => ({
  sticky: true,
  bg: "palette.background.default",
  alignItems: "center",
  justifyContent: "center",
}))`
  border-left: 1px solid ${p => p.theme.colors.palette.divider};
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
};

function ReadOnlyAddressField({ address }: Props) {
  const [copyFeedback, setCopyFeedback] = useState(false);

  const copyTimeout = useRef();

  const onCopy = useCallback(() => {
    clipboard.writeText(address);
    setCopyFeedback(true);
    clearTimeout(copyTimeout.current);
    copyTimeout.current = setTimeout(() => setCopyFeedback(false), 1e3);
  }, [address]);

  useEffect(() => {
    return () => {
      clearTimeout(copyTimeout.current);
    };
  }, []);

  return (
    <Box horizontal alignItems="stretch">
      <Address>
        {!copyFeedback ? null : (
          <CopyFeedback>
            <Trans i18nKey="common.addressCopied" />
          </CopyFeedback>
        )}
        {address}
      </Address>

      <CopyBtn onClick={onCopy}>
        <IconCopy size={16} />
      </CopyBtn>
    </Box>
  );
}

export default ReadOnlyAddressField;
