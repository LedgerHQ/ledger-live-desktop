// @flow
import type Transport from "@ledgerhq/hw-transport";

export default class NanoPass {
  transport: Transport<*>;

  constructor(transport: Transport<*>, scrambleKey: string = "NanoPass") {
    this.transport = transport;
  }

  /**
   * Strip zeros from buffer and return the stored string.
   */
  bufToString(buffer: Buffer): string {
    let size = buffer.length;
    while (size > 0 && buffer[size - 1] === 0) {
      size -= 1;
    }
    return buffer.slice(0, size).toString();
  }

  /**
   * Get number of stored passwords on the device
   */
  async getSize(): Promise<number> {
    const response = await this.transport.send(0x80, 0x02, 0, 0);
    return response.readUInt32BE(0);
  }

  /**
   * Get name of nth password.
   */
  async getName(index: number) {
    const data = Buffer.alloc(4);
    data.writeUInt32BE(index, 0);
    const response = await this.transport.send(0x80, 0x04, 0, 0, data);
    return this.bufToString(response.slice(0, response.length - 2));
  }

  /**
   * @return List of password names
   */
  async getNames(): Promise<Array<string>> {
    const size = await this.getSize();
    const result = [];
    for (let i = 0; i < size; i++) {
      const name = await this.getName(i);
      result.push(name);
    }
    console.log("result nano app", result);
    return result;
  }
}
