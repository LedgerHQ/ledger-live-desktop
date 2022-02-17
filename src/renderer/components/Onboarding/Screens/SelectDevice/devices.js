const devices = {
  nanoS: {
    productName: "Nano S",
  },
  nanoX: {
    productName: "Nano X",
  },
  nanoSP: {
    productName: "Nano S Plus",
  },
  blue: {
    productName: "Ledger Blue",
  },
};

export function deviceById(deviceId) {
  return devices[deviceId];
}
