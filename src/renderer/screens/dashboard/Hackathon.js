// @flow
import React from "react";
import styled from "styled-components";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { amnesiaCookiesSelector } from "~/renderer/reducers/settings";
import { useSelector } from "react-redux";
import { useConditionalDebounce } from "./useConditionalDebounce";
import Tabbable from "~/renderer/components/Box/Tabbable";
import Ellipsis from "~/renderer/components/Ellipsis";
import Icon from "~/renderer/icons/Nano";

import Hide from "~/renderer/components/MainSideBar/Hide";
import Box from "~/renderer/components/Box";
import Tooltip from "~/renderer/components/Tooltip";

const Container = styled(Tabbable).attrs(() => ({
  alignItems: "center",
  borderRadius: 1,
  ff: "Inter|SemiBold",
  flow: 3,
  horizontal: true,
  px: 3,
  py: 2,
}))`
  position: relative;
  width: 100%;
  cursor: ${p => (!p.isActive ? "default" : "pointer")};
  color: ${p => (p.isActive ? p.theme.colors.white : p.theme.colors.palette.text.shade80)};
  background: ${p =>
    p.amnesia ? "black" : p.isActive ? p.theme.colors.wallet : p.theme.colors.palette.text.shade20};
  opacity: ${p => (p.disabled ? 0.5 : 1)};

  &:hover {
    opacity: 0.9;
  }

  ${p => {
    const iconActiveColor = p.theme.colors[p.iconActiveColor] || p.iconActiveColor;
    const color = p.isActive ? iconActiveColor : p.theme.colors.palette.text.shade60;
    return `
      svg { color: ${color}; }
      &:hover svg { color: ${p.disabled ? color : iconActiveColor}; }
    `;
  }};
`;

const Hackathon = ({ collapsed, onClick }: { collapsed: boolean, onClick: () => void }) => {
  const rawDevice = useSelector(getCurrentDevice);
  const device = useConditionalDebounce(rawDevice, 3000, key => !key); // NB debounce disconnects in favor of connects
  const amnesiaCookies = useSelector(amnesiaCookiesSelector);

  // Perhaps consider using the name if we have access/time
  const wording = device ? device.cookie : "No connected device";
  return (
    <Tooltip
      content={"Some cool tooltip"}
      enabled={!!collapsed}
      boundary="window"
      placement="right"
    >
      <Container onClick={onClick} isActive={!!device} amnesia={amnesiaCookies.includes(wording)}>
        <Icon size={20} />
        <Box grow shrink>
          <Hide visible={!collapsed}>
            <Box horizontal justifyContent="space-between" alignItems="center">
              <Ellipsis>{wording}</Ellipsis>
            </Box>
          </Hide>
        </Box>
        {/* {NotifComponent} */}
      </Container>
    </Tooltip>
  );
};

export default Hackathon;
