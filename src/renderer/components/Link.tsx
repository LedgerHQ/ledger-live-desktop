import React, { PureComponent } from "react";
import BaseLink, { LinkProps } from "@ledgerhq/react-ui/components/cta/Link";
import { track } from "../analytics/segment";

export const Base: any = BaseLink;

type EventProps = {
  event?: string;
  eventProperties?: Object;
};

type RefProps = {
  innerRef: React.ForwardedRef<unknown>;
};

class Link extends PureComponent<LinkProps & EventProps & RefProps> {
  handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const { event, eventProperties, onClick } = this.props;
    if (onClick) {
      if (event) track(event, eventProperties || {});
      return onClick(e);
    }
  };

  render() {
    return <Base {...this.props} ref={this.props.innerRef} onClick={this.handleClick} />;
  }
}

export default React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />);
