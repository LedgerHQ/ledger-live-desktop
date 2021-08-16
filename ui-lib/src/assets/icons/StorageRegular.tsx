import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function StorageRegular({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9878 21.192C17.1478 21.192 21.1798 19.512 21.1798 16.776V7.17598C21.1798 4.46398 17.2918 2.80798 11.9878 2.80798C6.85182 2.80798 2.81982 4.46398 2.81982 7.17598V16.776C2.81982 19.512 6.75582 21.192 11.9878 21.192ZM4.37982 16.776V14.52C5.89182 15.72 8.67582 16.416 11.9878 16.416C15.2758 16.416 18.0598 15.696 19.6198 14.496V16.776C19.6198 18.456 16.6918 19.704 11.9878 19.704C7.21182 19.704 4.37982 18.456 4.37982 16.776ZM4.37982 12.048V9.64798C5.89182 10.848 8.67582 11.544 11.9878 11.544C15.2758 11.544 18.0598 10.848 19.6198 9.64798V12.048C19.5958 13.656 16.6678 14.928 11.9878 14.928C7.23582 14.928 4.37982 13.656 4.37982 12.048ZM4.37982 7.17598C4.37982 5.51998 7.30782 4.29598 11.9878 4.29598C16.8358 4.29598 19.6198 5.49598 19.6198 7.17598C19.5958 8.80798 16.6678 10.056 11.9878 10.056C7.23582 10.056 4.37982 8.80798 4.37982 7.17598Z"
        fill={color}
      />
    </svg>
  );
}

export default StorageRegular;
