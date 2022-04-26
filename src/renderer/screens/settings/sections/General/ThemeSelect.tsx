import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { setTheme } from "~/renderer/actions/settings";
import { userThemeSelector } from "~/renderer/reducers/settings";
import { SelectInput } from "@ledgerhq/react-ui";
import Track from "~/renderer/analytics/Track";

const themeLabels = {
  light: "theme.light",
  dark: "theme.dark",
};

type ThemeKey = keyof typeof themeLabels;
type ThemeOption = {
  value: ThemeKey | null;
  label: string;
};

const ThemeSelect = () => {
  const dispatch = useDispatch();
  const theme = useSelector(userThemeSelector);
  const { t } = useTranslation();

  const handleChangeTheme = useCallback(
    (option: ThemeOption | null) => {
      dispatch(setTheme(option?.value ?? null));
    },
    [dispatch],
  );

  const options = useMemo(() => {
    const themes: ThemeOption[] = Object.keys(themeLabels).map(key => ({
      value: key as ThemeKey,
      label: t(themeLabels[key as ThemeKey]),
    }));

    themes.unshift({ value: null, label: t("theme.system") });
    return themes;
  }, [t]);

  const currentTheme = options.find(option => option.value === theme);

  return (
    <>
      <Track onUpdate event="ThemeSelect" currentTheme={theme} />
      <SelectInput
        onChange={handleChangeTheme}
        options={options}
        value={currentTheme}
        styles={{ input: provided => ({ ...provided, width: "210px" }) }}
      />
    </>
  );
};

export default ThemeSelect;
