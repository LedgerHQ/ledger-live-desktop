// @flow
import { STATUS } from "~/renderer/screens/WalletConnect/Provider";

export type BodyProps = {
  onClose: Function,
  link: string,
};

export type FooterProps = {
  wcDappName: ?string,
  wcStatus: STATUS,
  onContinue: Function,
  onReject: Function,
};
