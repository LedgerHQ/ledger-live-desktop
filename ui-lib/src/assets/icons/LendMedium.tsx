import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function LendMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.62793 13.3441V15.1681C9.49193 14.3041 15.2999 10.8721 19.7639 5.92812C19.7159 6.52812 19.7159 7.10412 19.7159 7.68012V9.28812H21.3719L21.3479 3.12012H15.2039V4.80012H16.7159C17.2439 4.80012 17.8199 4.80012 18.3959 4.75212C14.1959 9.38412 8.96393 12.5041 2.62793 13.3441ZM2.62793 20.8801H4.66793V17.9521H2.62793V20.8801ZM6.80393 20.8801H8.84393V16.6081H6.80393V20.8801ZM10.9799 20.8801H13.0199V15.1921H10.9799V20.8801ZM15.1559 20.8801H17.1959V13.8241H15.1559V20.8801ZM19.3079 20.8801H21.3479V12.4801H19.3079V20.8801Z"
        fill={color}
      />
    </svg>
  );
}

export default LendMedium;
