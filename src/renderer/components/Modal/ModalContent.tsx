import { Popin } from "@ledgerhq/react-ui";

/**
 * This component is just a proxy to the Popin.Body component defined in @ledgerhq/react-ui.
 * It should only be used to map leagacy props/logic from LLD to the new popin component.
 *
 * @deprecated Please, prefer using the Popin.Body component from our design-system if possible.
 */
const ModalContent = Popin.Body;
export default ModalContent;
