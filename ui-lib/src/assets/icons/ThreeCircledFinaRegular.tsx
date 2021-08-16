import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function ThreeCircledFinaRegular({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.6079 16.68C12.5759 16.68 14.0399 15.528 14.0399 13.992C14.0399 13.008 13.4159 12.216 12.4799 11.952V11.688C13.2959 11.424 13.7279 10.728 13.7279 9.91201C13.7279 8.44801 12.3599 7.32001 10.6079 7.32001C8.73586 7.32001 7.34386 8.56801 7.34386 10.128V10.296H8.90386C8.90386 9.12001 9.31186 8.68801 10.5839 8.68801C11.8079 8.68801 12.2159 9.07201 12.2159 10.056C12.2159 10.968 11.9519 11.232 10.7039 11.232H9.79185V12.6H10.7279C12.0479 12.6 12.4319 12.936 12.4319 13.92C12.4319 14.952 11.9759 15.288 10.5839 15.288C9.16786 15.288 8.78385 14.904 8.78385 13.56H7.19986V13.68C7.19986 15.408 8.59186 16.68 10.6079 16.68ZM4.15186 21.24H10.6079C15.7919 21.24 19.8479 17.016 19.8479 12C19.8479 6.84001 15.7679 2.76001 10.6079 2.76001H4.15186V4.32001H10.6079C14.9279 4.32001 18.2879 7.68001 18.2879 12C18.2879 16.176 14.9279 19.68 10.6079 19.68H4.15186V21.24Z"
        fill={color}
      />
    </svg>
  );
}

export default ThreeCircledFinaRegular;
