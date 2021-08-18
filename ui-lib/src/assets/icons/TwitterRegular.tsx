import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function TwitterRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.17197 20.4C11.94 20.4 15.18 18.816 17.148 16.44C19.14 14.112 20.244 11.16 20.244 8.32798C20.244 8.08798 20.244 7.91998 20.196 7.79998C21.036 7.19998 21.756 6.45598 22.332 5.56798C21.54 5.92798 20.724 6.16798 19.932 6.26398C20.844 5.71198 21.468 4.91998 21.78 3.91198C20.94 4.39198 20.052 4.75198 19.068 4.94398C18.228 4.03198 17.196 3.59998 15.948 3.59998C13.644 3.59998 11.772 5.51998 11.772 7.82398C11.772 8.15998 11.796 8.47198 11.844 8.80798C8.38797 8.66398 5.24397 7.00798 3.13197 4.36798C2.72397 5.03998 2.50797 5.75998 2.50797 6.50398C2.50797 8.01598 3.15597 9.19198 4.40397 10.056C3.75597 10.032 3.10797 9.83998 2.50797 9.50398V9.57598C2.53197 11.76 4.54797 13.56 5.48397 13.8C5.24397 13.848 5.00397 13.872 4.76397 13.872C4.54797 13.872 4.28397 13.824 3.99597 13.8C4.54797 15.48 6.08397 16.728 7.97997 16.728C6.41997 17.928 4.64397 18.552 2.67597 18.552C2.31597 18.552 1.97997 18.528 1.66797 18.504C3.63597 19.752 5.79597 20.4 8.17197 20.4Z"
        fill={color}
      />
    </svg>
  );
}

export default TwitterRegular;
