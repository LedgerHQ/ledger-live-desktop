const fs = require("fs");
const glob = require("glob");
const camelcase = require("camelcase");
const path = require("path");
const svgr = require("@svgr/core").default;

const rootDir = path.join(__dirname, "../src/assets/icons");
const reactDir = `${rootDir}`;

// Create react folder if needed
if (!fs.existsSync(reactDir)) {
  fs.mkdirSync(reactDir);
}

// Component template
function reactTemplate({ template }, _, { imports, interfaces, componentName, __, jsx, exports }) {
  const plugins = ["typescript"];
  const tpl = template.smart({ plugins });

  return tpl.ast`
    ${imports}

    type Props = { size?: number | string; color?: string; };

    ${interfaces}

    function ${componentName} ({ size = 16, color = "currentColor" }: Props): JSX.Element {
      return ${jsx};
    }
    
    ${exports}
  `;
}

const convert = (svg, options, componentName, outputFile) => {
  svgr(svg, options, componentName)
    .then(result => {
      const component = result
        .replace("xlinkHref=", "href=")
        .replace(/fill=("(?!none)\S*")/g, "fill={color}");

      fs.writeFileSync(outputFile, component, "utf-8");
    })
    .catch(e => console.error(e));
};

glob(`${rootDir}/raw/**/*.svg`, (err, icons) => {
  // Create file stubs
  fs.writeFileSync(`${reactDir}/index.js`, "", "utf-8");

  // Extract the icon weight
  icons.forEach(icon => {
    const parts = icon.split("/");
    const weight = parts[parts.length - 2];

    let name = camelcase([path.basename(icon, ".svg"), weight], { pascalCase: true });

    if (!isNaN(name.charAt(0))) name = `_${name}`; // fix variable name leading with a numerical value

    const exportString = `export { default as ${name} } from "./${name}";\n`;

    fs.appendFileSync(`${reactDir}/index.js`, exportString, "utf-8");

    const svg = fs.readFileSync(icon, "utf-8");
    const options = {
      expandProps: false,
      componentName: name,
      svgProps: {
        height: "{size}",
        width: "{size}",
      },
    };

    convert(
      svg,
      { ...options, template: reactTemplate },
      { componentName: name },
      `${reactDir}/${name}.tsx`,
    );
  });
});
