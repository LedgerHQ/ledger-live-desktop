import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function FiltersMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.19191 21.3599V17.4719H8.15991V15.5519H2.15991V17.4719H4.15191V21.3599H6.19191ZM4.15191 13.6319H6.19191V2.63989H4.15191V13.6319ZM8.99991 8.39989H14.9999V6.47989H13.0319V2.63989H10.9919V6.47989H8.99991V8.39989ZM10.9919 21.3599H13.0319V10.3199H10.9919V21.3599ZM15.8399 17.4719H17.8319V21.3599H19.8719V17.4719H21.8399V15.5519H15.8399V17.4719ZM17.8319 13.6319H19.8719V2.63989H17.8319V13.6319Z"
        fill={color}
      />
    </svg>
  );
}

export default FiltersMedium;
