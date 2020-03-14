// @flow

import React from "react";
import map from "lodash/map";
import { Trans } from "react-i18next";
import { connect } from "react-redux";
import styled from "styled-components";
import palettes from "~/renderer/styles/palettes";
import { themeSelector } from "~/renderer/actions/general";
import { setTheme } from "~/renderer/actions/settings";
import Text from "~/renderer/components/Text";
import Track from "~/renderer/analytics/Track";

type Props = {
  setTheme: (?string) => void,
  currentTheme: string,
};

type PictoProps = {
  palette: any,
  onClick: () => any,
  active: boolean,
};

const themeLabels = {
  light: "theme.light",
  dusk: "theme.dusk",
  dark: "theme.dark",
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

const ThemeSelectorContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 40px;
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

const ThemeSelector = ({ setTheme, currentTheme }: Props) => (
  <ThemeSelectorContainer>
    <Track event="ThemeSelector" onUpdate currentTheme={currentTheme} />
    {map(palettes, (palette, paletteName: string) => (
      <ThemeContainer key={paletteName} id={paletteName}>
        <ThemePicto
          onClick={() => setTheme(paletteName)}
          active={paletteName === currentTheme}
          palette={palette}
        />
        <ThemeName
          ff="Inter|SemiBold"
          color={paletteName === currentTheme ? "palette.primary.main" : "palette.text.shade80"}
          fontSize={5}
          onClick={() => setTheme(paletteName)}
        >
          <Trans i18nKey={themeLabels[paletteName]} />
        </ThemeName>
      </ThemeContainer>
    ))}
  </ThemeSelectorContainer>
);

const mapStateToProps = state => ({
  currentTheme: themeSelector(state),
});

const ConnectedThemeSelector: React$ComponentType<{}> = connect(mapStateToProps, {
  setTheme,
})(ThemeSelector);

export default ConnectedThemeSelector;
