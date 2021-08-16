import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function FiltersUltraLight({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.78391 21.36V16.392H8.51991V15.552H2.15991V16.392H4.89591V21.36H5.78391ZM4.89591 13.632H5.78391V2.64H4.89591V13.632ZM8.83191 8.4H15.1919V7.56H12.4319V2.64H11.5679V7.56H8.83191V8.4ZM11.5679 21.36H12.4319V10.32H11.5679V21.36ZM15.4799 16.392H18.2159V21.36H19.1039V16.392H21.8399V15.552H15.4799V16.392ZM18.2159 13.632H19.1039V2.64H18.2159V13.632Z" fill={color} /></svg>;
}

export default FiltersUltraLight;