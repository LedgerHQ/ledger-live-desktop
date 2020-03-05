// @flow
const getos = () =>
  new Promise((resolve, reject) => {
    require("getos")((e, os) => (e ? reject(e) : resolve(os)));
  });

const osName = async () => {
  if (process.platform !== "linux") return require("os-name")();

  const { dist, codename, release } = await getos();
  const code = codename ? `(codename: ${codename})` : "";

  return `${dist} ${release} ${code}`;
};

export default osName;
