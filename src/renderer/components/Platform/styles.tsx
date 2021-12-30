import { css } from "styled-components";

export const containerButtonCSS = css<{ disabled?: boolean }>`
  border: 1px solid ${p => p.theme.colors.neutral.c30};
  ${p =>
    p.disabled
      ? css`
          opacity: 0.6;
        `
      : css`
          cursor: pointer;
          :hover {
            border-color: ${p => p.theme.colors.primary.c30};
          }
        `}
`;
