// @flow

const assetUrls = [];

export function registerAssets(assetUrl: string | string[]) {
  if (Array.isArray(assetUrl)) {
    assetUrl.forEach(url => {
      assetUrls.push(url);
    });
  } else {
    assetUrls.push(assetUrl);
  }
}

export function preloadAssets() {
  assetUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}
