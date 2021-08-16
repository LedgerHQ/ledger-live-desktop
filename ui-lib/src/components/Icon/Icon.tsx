import * as Icons from "../../assets/icons";
import invariant from "invariant";

type Props = {
  name: string;
  size: number;
  weight: "Regular" | "Thin" | "Light" | "Medium" | "UltraLight";
  color?: string;
};

export const iconNames = Array.from(
  Object.keys(Icons).reduce((set, rawKey) => {
    const key = rawKey
      .replace(/(.+)(Regular|Light|UltraLight|Thin|Medium)+$/g, "$1")
      .replace(/(.+)(Ultra)+$/g, "$1");
    if (!set.has(key)) set.add(key);
    return set;
  }, new Set()),
);

const Icon = ({ name, size = 16, color = "currentColor", weight = "Regular" }: Props): Svg => {
  const Component = Icons[`${name}${weight}`];
  invariant(Component, `No icon found for id ${name}}`);
  return <Component size={size} color={color} />;
};

export default Icon;
