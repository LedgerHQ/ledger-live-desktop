import nanoS from "./Screens/SelectDevice/assets/nanoS.svg";
import nanoX from "./Screens/SelectDevice/assets/nanoX.svg";
import nanoBlue from "./Screens/SelectDevice/assets/nanoBlue.svg";

const assetUrls = [nanoS, nanoX, nanoBlue];

export function preloadAssets() {
  assetUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}
