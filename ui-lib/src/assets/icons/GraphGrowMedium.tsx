import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function GraphGrowMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.62793 15.2401L7.83593 10.0321H15.7319L19.7639 6.02412C19.7159 6.62412 19.7159 7.20012 19.7159 7.77612V9.28812H21.3719L21.3479 3.12012H15.2039V4.80012H16.7159C17.2679 4.80012 17.8679 4.80012 18.4439 4.75212L14.9639 8.23212H7.11593L2.62793 12.6961V15.2401ZM2.62793 20.8801H4.66793V17.9521H2.62793V20.8801ZM6.80393 20.8801H8.84393V16.0561H6.80393V20.8801ZM10.9799 20.8801H13.0199V12.9601H10.9799V20.8801ZM15.1559 20.8801H17.1959V15.1201H15.1559V20.8801ZM19.3079 20.8801H21.3479V12.0001H19.3079V20.8801Z"
        fill={color}
      />
    </svg>
  );
}

export default GraphGrowMedium;
