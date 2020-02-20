// @flow
import type { DescriptorEvent } from "@ledgerhq/hw-transport";
import { Observable } from "rxjs";
import TransportNodeHidSingleton from "@ledgerhq/hw-transport-node-hid-singleton";

const cmd = (): Observable<DescriptorEvent<*>> =>
  Observable.create(TransportNodeHidSingleton.listen);

export default cmd;
