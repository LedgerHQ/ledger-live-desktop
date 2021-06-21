// @flow
import React, { useCallback } from "react";
import styled from "styled-components";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { setCurrentDevice } from "~/renderer/actions/devices";
import { useSelector, useDispatch } from "react-redux";

const Wrapper: any = styled.div`
  position: absolute;
  bottom: 0;
  right: 10px;
  padding: 20px;
  text-family: monospace;
  font-size: 10px;
  margin-bottom: 10px;
  display: flex;
`;

const HackathonController = () => {
  const dispatch = useDispatch();
  const currentDevice = useSelector(getCurrentDevice);
  const onSelectDevice = useCallback(() => dispatch(setCurrentDevice({})), []);
  return (
    <Wrapper>
      <button onClick={()=>onSelectDevice(0)}>{"Seed 1"}</button>
      <button onClick={()=>onSelectDevice(1)}>{"Seed 2"}</button>
    </Wrapper>
  );
};

export default HackathonController;

