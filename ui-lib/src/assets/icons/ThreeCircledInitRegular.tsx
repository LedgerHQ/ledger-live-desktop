import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function ThreeCircledInitRegular({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.3919 16.68C15.3599 16.68 16.8239 15.528 16.8239 13.992C16.8239 13.008 16.1999 12.216 15.2639 11.952V11.688C16.0799 11.424 16.5119 10.728 16.5119 9.91201C16.5119 8.44801 15.1439 7.32001 13.3919 7.32001C11.5199 7.32001 10.1279 8.56801 10.1279 10.128V10.296H11.6879C11.6879 9.12001 12.0959 8.68801 13.3679 8.68801C14.5919 8.68801 14.9999 9.07201 14.9999 10.056C14.9999 10.968 14.7359 11.232 13.4879 11.232H12.5759V12.6H13.5119C14.8319 12.6 15.2159 12.936 15.2159 13.92C15.2159 14.952 14.7599 15.288 13.3679 15.288C11.9519 15.288 11.5679 14.904 11.5679 13.56H9.98386V13.68C9.98386 15.408 11.3759 16.68 13.3919 16.68ZM4.15186 12C4.15186 17.16 8.23186 21.24 13.3919 21.24H19.8479V19.68H13.3919C9.09586 19.68 5.71186 16.296 5.71186 12C5.71186 7.80001 9.09586 4.32001 13.3919 4.32001H19.8479V2.76001H13.3919C8.20786 2.76001 4.15186 6.96001 4.15186 12Z"
        fill={color}
      />
    </svg>
  );
}

export default ThreeCircledInitRegular;
