import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function EntitiesThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.68018 21.36H7.68018V15.36H4.92018V12.24H11.7602V15.36H9.00018V21.36H15.0002V15.36H12.2402V12.24H19.0802V15.36H16.3202V21.36H22.3202V15.36H19.5602V11.76H12.2402V8.64002H15.0002V2.64001H9.00018V8.64002H11.7602V11.76H4.44018V15.36H1.68018V21.36ZM2.16018 20.88V15.84H7.20018V20.88H2.16018ZM9.48018 20.88V15.84H14.5202V20.88H9.48018ZM9.48018 8.16002V3.12001H14.5202V8.16002H9.48018ZM16.8002 20.88V15.84H21.8402V20.88H16.8002Z"
        fill={color}
      />
    </svg>
  );
}

export default EntitiesThin;
