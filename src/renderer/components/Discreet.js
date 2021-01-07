import { useSelector } from "react-redux";
import { discreetModeSelector } from "~/renderer/reducers/settings";

export const useDiscreetMode = () => useSelector(discreetModeSelector);

const Discreet = ({ children, replace = "***" }) => {
  const discreetMode = useDiscreetMode();

  if (discreetMode) {
    return replace;
  }

  return children;
};

export default Discreet;
