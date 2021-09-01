import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function EntitiesRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.68018 21.36H7.68018V15.36H5.37618V12.696H11.3042V15.36H9.00018V21.36H15.0002V15.36H12.6962V12.696H18.6242V15.36H16.3202V21.36H22.3202V15.36H20.0162V11.304H12.6962V8.64002H15.0002V2.64001H9.00018V8.64002H11.3042V11.304H3.98418V15.36H1.68018V21.36ZM3.07218 20.04V16.68H6.31218V20.04H3.07218ZM10.3922 20.04V16.68H13.6322V20.04H10.3922ZM10.3922 7.32001V3.96001H13.6322V7.32001H10.3922ZM17.7122 20.04V16.68H20.9522V20.04H17.7122Z"
        fill={color}
      />
    </svg>
  );
}

export default EntitiesRegular;
