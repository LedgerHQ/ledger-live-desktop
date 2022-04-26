import React from "react";

import { Popin, Text, Flex } from "@ledgerhq/react-ui";

export type RenderProps = {
  onClose?: () => {};
  data: any;
};

type Props = {
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  headerStyle?: any;
  onBack?: () => void;
  onClose?: () => void;
  render?: (props?: RenderProps) => React.ReactNode;
  renderFooter?: (props?: RenderProps) => React.ReactNode;
  modalFooterStyle?: any;
  renderProps?: RenderProps;
  noScroll?: boolean;
  refocusWhenChange?: any;
  isOpen?: boolean;
};

/**
 * This component is just a proxy to the skeleton inside the Popin component defined in @ledgerhq/react-ui.
 * It should only be used to map leagacy props/logic from LLD to the new popin component.
 *
 * @deprecated Please, prefer using the Popin component from our design-system if possible.
 */
const ModalBody = ({
  onBack,
  onClose,
  title,
  subTitle,
  render,
  renderFooter,
  renderProps,
  modalFooterStyle,
}: Props) => (
  <>
    <Popin.Header onBack={onBack} onClose={onClose}>
      <Flex flexDirection="column">
        {title ? <Text variant="h4">{title}</Text> : null}
        {subTitle ? <Text variant="h5">{subTitle || null}</Text> : null}
      </Flex>
    </Popin.Header>
    {render && <Popin.Body>{render(renderProps)}</Popin.Body>}
    {renderFooter && (
      <Popin.Footer style={modalFooterStyle}>{renderFooter(renderProps)}</Popin.Footer>
    )}
  </>
);

// export default React.memo(ModalBody);
export default ModalBody;
