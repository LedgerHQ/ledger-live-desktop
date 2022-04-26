import { PureComponent } from "react";
import logger from "~/logger";
import { track } from "./segment";

class Track extends PureComponent<{
  onMount?: boolean;
  onUnmount?: boolean;
  onUpdate?: boolean;
  event: string;
  mandatory?: boolean | null;
  [key: string]: any;
}> {
  componentDidMount() {
    if (typeof this.props.event !== "string") {
      (logger as any).warn("analytics Track: invalid event=", this.props.event);
    }
    if (this.props.onMount) this.track();
  }

  componentDidUpdate() {
    if (this.props.onUpdate) this.track();
  }

  componentWillUnmount() {
    if (this.props.onUnmount) this.track();
  }

  track = () => {
    const { event, onMount, onUnmount, onUpdate, mandatory, ...properties } = this.props;
    track(event, properties, mandatory ?? null);
  };

  render() {
    return null;
  }
}

export default Track;
