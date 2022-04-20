const devices = {
  nanoS: {
    productName: "Nano S",
  },
  nanoX: {
    productName: "Nano X",
  },
  nanoSP: {
    productName: "Nano S 2",
  },
};

export function deviceById(deviceId: keyof typeof devices) {
  return devices[deviceId];
}
