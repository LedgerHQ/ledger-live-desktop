import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function BarChartRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.5839 20.88H21.5999V3.12H16.5839V20.88ZM2.3999 20.88H7.4159V7.368H2.3999V20.88ZM3.7919 19.488V8.736H6.0479V19.488H3.7919ZM9.4799 20.88H14.5199V10.824H9.4799V20.88ZM10.8719 19.488V12.192H13.1519V19.488H10.8719ZM17.9759 19.488V4.488H20.2319V19.488H17.9759Z"
        fill={color}
      />
    </svg>
  );
}

export default BarChartRegular;
