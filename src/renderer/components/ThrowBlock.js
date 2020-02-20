// @flow
import React, { PureComponent } from "react";
import logger from "~/logger";
import RenderError from "./RenderError";

type Props = {
  children: any,
};

type State = {
  error: ?Error,
};

class ThrowBlock extends PureComponent<Props, State> {
  state = {
    error: null,
  };

  componentDidCatch(error: Error) {
    logger.critical(error);
    this.setState({ error });
  }

  render() {
    const { error } = this.state;
    if (error) {
      return <RenderError error={error} />;
    }
    return this.props.children;
  }
}

export default ThrowBlock;
