import { css } from "styled-components";
import { Theme } from "~/renderer/styles/theme";

export function getBackgroundColor(theme: Theme) {
  const isLight = theme.colors.type === "light";
  return theme.colors.neutral[isLight ? "c40" : "c30"];
}

export function getBorderColor(theme: Theme) {
  const isLight = theme.colors.type === "light";
  return theme.colors.primary[isLight ? "c50" : "c30"];
}

export const containerButtonCSS = css<{ disabled?: boolean }>`
  background-color: ${p => getBackgroundColor(p.theme)};
  border: 1px solid ${p => getBackgroundColor(p.theme)};
  ${p =>
    p.disabled
      ? css`
          opacity: 0.6;
        `
      : css`
          cursor: pointer;
          :hover {
            border-color: ${p => getBorderColor(p.theme)};
          }
        `}
`;
