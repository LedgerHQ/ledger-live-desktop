// @flow
import type { DescriptorEvent } from "@ledgerhq/hw-transport";
import { Observable } from "rxjs";
import BluetoothTransport from "@ledgerhq/hw-transport-node-ble";

const cmd = (): Observable<DescriptorEvent<*>> =>
  Observable.create(o => {
    BluetoothTransport.availability.subscribe(available => {
      o.next(available);
      if (available) {
        o.next("BLE available");
        BluetoothTransport.listen(e => {
          o.next(e);
        });
      }
    });
  });

export default cmd;
