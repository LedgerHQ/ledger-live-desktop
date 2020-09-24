// @flow

import React, { PureComponent } from "react";

import ModalContent from "./ModalContent";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";

import type { RenderProps } from ".";

type Props = {
  title?: React$Node,
  subTitle?: React$Node,
  headerStyle?: *,
  onBack?: void => void,
  onClose?: void => void,
  render?: (?RenderProps) => any,
  renderFooter?: (?RenderProps) => any,
  modalFooterStyle?: *,
  renderProps?: RenderProps,
  noScroll?: boolean,
  refocusWhenChange?: any,
};

class ModalBody extends PureComponent<Props> {
  componentDidUpdate(prevProps: Props) {
    const shouldFocus = prevProps.refocusWhenChange !== this.props.refocusWhenChange;
    if (shouldFocus && this._content.current) {
      this._content.current.focus();
    }
  }

  _content: React$ElementRef<*> = React.createRef();

  render() {
    const {
      onBack,
      onClose,
      title,
      subTitle,
      headerStyle,
      render,
      renderFooter,
      renderProps,
      noScroll,
      modalFooterStyle,
    } = this.props;

    // For `renderFooter` returning falsy values, we need to resolve first.
    const renderedFooter = renderFooter && renderFooter(renderProps);
    return (
      <>
        <ModalHeader subTitle={subTitle} onBack={onBack} onClose={onClose} style={headerStyle}>
          {title || null}
        </ModalHeader>
        <ModalContent ref={this._content} noScroll={noScroll}>
          {render && render(renderProps)}
        </ModalContent>
        {renderedFooter && <ModalFooter style={modalFooterStyle}>{renderedFooter}</ModalFooter>}
      </>
    );
  }
}

export default ModalBody;
