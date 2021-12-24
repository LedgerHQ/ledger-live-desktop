import React, { useRef, useState, useEffect, useCallback } from "react";
import { Trans } from "react-i18next";
import { clipboard } from "electron";
import { Button, Flex, Text, Icons } from "@ledgerhq/react-ui";
import { FlexBoxProps } from "@ledgerhq/react-ui/components/layout/Flex";

type Props = {
  address: string;
  allowCopy?: boolean;
  extraCopyContainerProps?: FlexBoxProps;
};

function ReadOnlyAddressField({ address, extraCopyContainerProps, allowCopy = true }: Props) {
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [clibboardChanged, setClipboardChanged] = useState(false);

  const copyTimeout = useRef<number>();

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
    // @ts-expect-error NodeJS bindings ruin it all…
    copyTimeout.current = setTimeout(() => setCopyFeedback(false), 1e3);
  }, [address]);

  useEffect(() => {
    return () => {
      clearTimeout(copyTimeout.current);
    };
  }, []);

  return (
    <Flex flexDirection="column" rowGap={3}>
      {clibboardChanged ? (
        <Text variant="small" color="error.c100">
          <Trans i18nKey="common.addressCopiedSuspicious" />
        </Text>
      ) : null}
      <Flex alignItems="center" columnGap={3}>
        {allowCopy ? (
          <Button.Unstyled onClick={onCopy}>
            <Flex
              display="inline-flex"
              alignItems="center"
              color="primary.c90"
              {...extraCopyContainerProps}
            >
              <Icons.CopyMedium size={16} />
              <Text variant="small" color="inherit" fontWeight="600" ml={2}>
                <Trans i18nKey={copyFeedback ? "common.addressCopied" : "v3.common.copy"} />
              </Text>
            </Flex>
          </Button.Unstyled>
        ) : null}
        <Text variant="small" color="inherit">
          {address}
        </Text>
      </Flex>
    </Flex>
  );
}

export default ReadOnlyAddressField;
