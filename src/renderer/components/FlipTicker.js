// @flow

/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react/no-array-index-key */

import React, { PureComponent } from "react";
import styled from "styled-components";
import { Spring, animated } from "react-spring/renderprops";

import Box from "~/renderer/components/Box";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const Container: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
  relative: true,
}))`
  overflow: hidden;
  white-space: pre;
`;

const RANGE_NUMBER = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const RANGE_COMPONENT = RANGE_NUMBER.map((r, i) => <Box key={i}>{r}</Box>);

const SPRINT_CONFIG = { tension: 130, friction: 12 };

type Props = {
  value: string,
};

type State = {
  height: ?number,
};

class FlipTicker extends PureComponent<Props, State> {
  state = {
    height: null,
  };

  componentDidMount() {
    if (this._node instanceof HTMLDivElement) {
      const { height } = this._node.getBoundingClientRect();
      this.setState({
        height,
      });
    }
  }

  _node = null;

  render() {
    const { value, ...p } = this.props;
    const { height } = this.state;
    return (
      <Container {...p} ref={n => (this._node = n)}>
        {[...value].map((l, i) => (
          <Box key={i}>
            {!/[0-9]/.test(l) ? (
              l === " " ? (
                <span>&nbsp;</span>
              ) : (
                l
              )
            ) : (
              <>
                <span
                  style={{
                    visibility: "hidden",
                  }}
                >
                  {l}
                </span>
                {height && <Tick height={height} value={l} />}
              </>
            )}
          </Box>
        ))}
      </Container>
    );
  }
}

function Tick(props: { height: number, value: string }) {
  const { height, value } = props;

  const index = RANGE_NUMBER.indexOf(value);
  const offset = height * index;

  const Content = <Box>{RANGE_COMPONENT}</Box>;

  return (
    <Spring
      native
      config={SPRINT_CONFIG}
      to={{
        offset,
      }}
    >
      {m => (
        <animated.div
          style={{
            transform: m.offset.interpolate(v => `translate3d(0, -${v}px, 0)`),
            top: 0,
            position: "absolute",
          }}
        >
          {Content}
        </animated.div>
      )}
    </Spring>
  );
}

export default FlipTicker;
