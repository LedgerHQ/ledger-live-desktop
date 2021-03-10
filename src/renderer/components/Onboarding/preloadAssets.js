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
  const promises = [];
  assetUrls.forEach(url => {
    promises.push(
      new Promise(resolve => {
        const img = new Image();
        img.src = url;
        img.onload = resolve;
      }),
    );
  });
  return Promise.all(promises);
}
