const devices = {
  nanoS: {
    productName: "Nano S",
  },
  nanoX: {
    productName: "Nano X",
  },
  blue: {
    productName: "Ledger Blue",
  },
};

export function deviceById(deviceId) {
  return devices[deviceId];
}
