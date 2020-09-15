// @flow

import React, { PureComponent } from "react";
import { uncontrollable } from "uncontrollable";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import IconChevronRight from "~/renderer/icons/ChevronRight";

type Props = {
  children: any,
  title: string,
  opened: boolean,
  onOpen: boolean => void,
};

type State = {
  isOpened: boolean,
};

const Title = styled(Text).attrs(p => ({
  ff: p.ff ? p.ff : "Inter|Bold",
  fontSize: p.fontSize ? p.fontSize : 2,
  color: p.color ? p.color : "palette.text.shade100",
  tabIndex: 0,
}))`
  text-transform: ${p => (!p.textTransform ? "auto" : "uppercase")};
  letter-spacing: 1px;
  outline: none;
`;

const IconContainer: ThemedComponent<{ isOpened?: boolean }> = styled(Box)`
  transform: rotate(${p => (p.isOpened ? "90" : "0")}deg);
  transition: 150ms linear transform;
`;

export class SpoilerIcon extends PureComponent<{ isOpened: boolean, mr?: * }> {
  render() {
    const { isOpened, mr } = this.props;
    return (
      <IconContainer isOpened={isOpened} mr={mr}>
        <IconChevronRight size={12} />
      </IconContainer>
    );
  }
}

/* eslint-disable react/no-multi-comp */

class Spoiler extends PureComponent<Props, State> {
  toggle = () => {
    const { opened, onOpen } = this.props;
    onOpen(!opened);
  };

  render() {
    const { title, opened, onOpen, children, ...p } = this.props;
    return (
      <>
        <Box
          onClick={this.toggle}
          horizontal
          flow={1}
          color="palette.text.shade100"
          cursor="pointer"
          alignItems="center"
        >
          <SpoilerIcon isOpened={opened} />
          <Title {...p}>{title}</Title>
        </Box>
        {opened && children}
      </>
    );
  }
}

export default uncontrollable(Spoiler, {
  opened: "onOpen",
});
