// @flow

import React, { useEffect, useCallback } from "react";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "~/renderer/actions/settings";
import { userThemeSelector } from "~/renderer/reducers/settings";
import palettes from "~/renderer/styles/palettes";
import { Trans } from "react-i18next";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

type PictoProps = {
  palette: any,
  onClick: () => any,
  active: boolean,
};

const ThemePictoContainer = styled.div.attrs(p => ({
  style: {
    border: p.active ? `2px solid ${p.theme.colors.palette.primary.main}` : "none",
    transform: `scale(${p.active ? 1.17 : 1})`,
    backgroundColor: p.palette.background.paper,
    cursor: p.active ? "default" : "pointer",
  },
}))`
  margin: 16px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  width: 52px;
  transition: transform 300ms ease-in-out;
`;

const ThemePicto = ({ palette, onClick, active }: PictoProps) => (
  <ThemePictoContainer onClick={onClick} active={active} palette={palette}>
    <svg width="48" height="48">
      <defs />
      <g fill="none" fillRule="evenodd">
        <path
          fill={palette.type === "light" ? "#000" : "#FFF"}
          d="M16.2 5c1.1045695 0 2 .8954305 2 2v34.4c0 1.1045695-.8954305 2-2 2H7c-1.1045695 0-2-.8954305-2-2V7c0-1.1045695.8954305-2 2-2h9.2zm25.2 27.0857143c1.1045695 0 2 .8954305 2 2v.8c0 1.1045695-.8954305 2-2 2H25c-1.1045695 0-2-.8954305-2-2v-.8c0-1.1045695.8954305-2 2-2h16.4zm0-8.2285714c1.1045695 0 2 .8954305 2 2v.8c0 1.1045695-.8954305 2-2 2H25c-1.1045695 0-2-.8954305-2-2v-.8c0-1.1045695.8954305-2 2-2h16.4zM41.4 5c1.1045695 0 2 .8954305 2 2v11.4285714c0 1.1045695-.8954305 2-2 2H25c-1.1045695 0-2-.8954305-2-2V7c0-1.1045695.8954305-2 2-2h16.4z"
          opacity=".16"
        />
      </g>
    </svg>
  </ThemePictoContainer>
);

const ThemeSelectorContainer: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 40px;
  align-items: center;
  justify-content: center;
`;

const ThemeContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const ThemeName = styled(Text)`
  transition: color ease-out 300ms;
  transition-delay: 300ms;
  cursor: pointer;
`;

const ThemeSelector = ({ setCanContinue }: { setCanContinue: boolean => void }) => {
  const currentTheme = useSelector(userThemeSelector) || "light";
  const dispatch = useDispatch();
  const onSetTheme = useCallback(
    themeKey => {
      dispatch(setTheme(themeKey));
    },
    [dispatch],
  );

  useEffect(() => {
    setCanContinue(true); // NB no validation neeeded.
  });

  return (
    <Box mt={60}>
      <Text ff={"Inter|Regular"} fontSize={4} textAlign={"center"} mb={22}>
        <Trans i18nKey={"productTour.flows.customize.modal.theme.help"} />
      </Text>
      <ThemeSelectorContainer id={"test"}>
        {Object.keys(palettes).map(paletteKey => (
          <ThemeContainer key={paletteKey}>
            <ThemePicto
              onClick={() => onSetTheme(paletteKey)}
              active={paletteKey === currentTheme}
              palette={palettes[paletteKey]}
            />
            <ThemeName
              ff="Inter|SemiBold"
              color={paletteKey === currentTheme ? "palette.primary.main" : "palette.text.shade80"}
              fontSize={5}
              onClick={() => onSetTheme(paletteKey)}
            >
              <Trans i18nKey={`theme.${paletteKey}`} />
            </ThemeName>
          </ThemeContainer>
        ))}
      </ThemeSelectorContainer>
    </Box>
  );
};

export default ThemeSelector;
