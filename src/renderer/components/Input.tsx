import React, { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Flex, InfiniteLoader, Input as BaseInput } from "@ledgerhq/react-ui";
import type { InputProps } from "@ledgerhq/react-ui/components/form/BaseInput"

export interface Props extends Omit<InputProps, "error" | "warning"> {
  onEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onEsc?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  loading?: boolean,
  error?: Error | string,
  warning?: Error | string,
};

export default function Input({ onEnter, onEsc, error, warning, loading, ...baseInputProps} : Props) {
  const { t } = useTranslation();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.code === "Enter" && onEnter) {
        onEnter(e);
      } else if (e.code === "Escape" && onEsc) {
        onEsc(e);
      }
    },
    [onEnter, onEsc],
  );

  const [errorMsg, warningMsg] = useMemo(() => (
    [error, warning].map(elt => {
      if(!elt || typeof elt === "string")
        return elt as string | undefined
      const field = "title";
      const arg = Object.assign({ message: elt.message, returnObjects: true }, elt);
      if (elt.name) {
        const translation = t(`errors.${elt.name}.${field}`, arg);
        if (translation !== `errors.${elt.name}.${field}`) {
          // It is translated
          if (translation && typeof translation === "object") {
            // It is a list
            return Object.values(translation).map(str =>
              typeof str === "string" ? str : null,
            ).filter(Boolean).join("\n");
          }
          return translation;
        }
      }

      const genericTranslation = t(`errors.generic.${field}`, arg);
      return genericTranslation === `errors.generic.${field}` ? undefined : genericTranslation;
    })
  ), [error, warning])

  if(loading) {
    const right = (props) => (
      <Flex alignItems="center" pr={4}>
        <InfiniteLoader />
        { typeof baseInputProps.renderRight === "function" ? baseInputProps.renderRight(props) : baseInputProps.renderRight }
      </Flex>
    )
    return (
      <BaseInput
        error={errorMsg}
        warning={warningMsg}
        onKeyDown={handleKeyDown}
        {...baseInputProps}
        renderRight={right}
        placeholder={loading ? "" : baseInputProps.placeholder}
        value={loading ? "" : baseInputProps.value}
      />
    )
  } else {
    return <BaseInput error={errorMsg} warning={warningMsg} onKeyDown={handleKeyDown} {...baseInputProps} />
  }


}