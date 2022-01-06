module.exports = {
  hooks: {
    readPackage,
  },
};

function readPackage(pkg, context) {
  if (
    pkg.name === "stellar-base" &&
    pkg.optionalDependencies &&
    pkg.optionalDependencies["sodium-native"]
  ) {
    context.log(`${pkg.name}: sodium-native optional dependency forced to "^3.2.1"`);
    pkg.optionalDependencies["sodium-native"] = "^3.2.1";
  }
  return pkg;
}
