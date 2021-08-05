import { ff } from "../helpers";

export default (props: { ff?: string }): any => {
  const prop = props.ff;

  if (prop == null) {
    return null;
  }

  return ff(prop);
};
