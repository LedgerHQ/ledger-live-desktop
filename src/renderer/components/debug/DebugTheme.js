// @flow
/* eslint-disable react/jsx-no-literals */

import React, { useCallback } from "react";
import Box from "~/renderer/components/Box";
import { setTheme } from "~/renderer/actions/settings";
import { useDispatch } from "react-redux";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import styled from "styled-components";

const Item: ThemedComponent<{}> = styled.div`
  padding: 2px 13px;
  background: ${p => p.theme.colors.alertRed};
  opacity: 0.9;
  height: 100%;
  min-height: 22px;
`;

const DebugTheme = () => {
  const dispatch = useDispatch();

  const handleChangeTheme = useCallback(
    theme => {
      dispatch(setTheme(theme));
    },
    [dispatch],
  );

  return (
    <Box p={0} horizontal>
      <Item
        style={{ backgroundColor: "#FFFFFF" }}
        onClick={() => handleChangeTheme("light")}
      ></Item>
      <Item style={{ backgroundColor: "#1C1D1F" }} onClick={() => handleChangeTheme("dark")}></Item>
    </Box>
  );
};

export default DebugTheme;
