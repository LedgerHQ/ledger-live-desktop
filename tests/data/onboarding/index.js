import genuine from "./genuine";
import password from "./password";
import analytics from "./analytics";
import lockscreen from "./lockscreen";

export default {
  appTitle: "Ledger Live",
  duskColor: "#182532",
  darkColor: "#1c1d1f",
  lightColor: "#ffffff",
  welcome: {
    title: "Welcome to Ledger Live",
    description:
      "Let’s start by choosing how Ledger Live looks to you. You can change this later at any time in your settings.",
  },
  getStartedTitle: "Get started with your Ledger device",
  selectDeviceTitle: "Select your device",
  choosePinTitle: "Choose your PIN code",
  saveSeedTitle: "Write down your recovery phrase",
  enterSeedTitle: "Enter your recovery phrase",
  noDeviceTitle: "Don't have a Ledger device?",
  genuine,
  password,
  analytics,
  lockscreen,
  end: {
    title: "Your device is ready!",
    description: "Install some apps on your device and access the Portfolio",
  },
};
