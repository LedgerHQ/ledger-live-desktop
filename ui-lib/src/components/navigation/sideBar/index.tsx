import { createContext } from "react";

type SideBarContextType = { isExpanded: boolean; onToggle: () => void };
export default createContext<Partial<SideBarContextType>>({});
