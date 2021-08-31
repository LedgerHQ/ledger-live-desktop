import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function AppleUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.9998 21.84C9.4798 21.84 10.1758 21.624 10.6318 21.432C11.2558 21.192 11.8798 21.048 12.4318 21.048C12.9358 21.048 13.5118 21.192 14.1838 21.432C14.8078 21.696 15.3358 21.84 15.7918 21.84C16.4158 21.84 16.9918 21.552 17.5438 21.048C17.8798 20.784 18.3358 20.208 18.8878 19.416C19.2958 18.864 19.6558 18.216 19.9678 17.52L20.3038 16.608C18.7678 15.96 17.6158 14.496 17.6158 12.6C17.5678 10.968 18.3118 9.696 19.7998 8.808C18.9358 7.608 17.7118 6.96 16.0798 6.84C15.4318 6.792 14.6878 6.936 13.8238 7.248C12.8878 7.584 12.3118 7.752 12.1438 7.752C11.9518 7.752 11.4238 7.608 10.6798 7.296C9.8638 7.032 9.2638 6.888 8.7838 6.888C7.9198 6.912 7.1278 7.104 6.3838 7.56C5.6158 7.992 5.0398 8.592 4.5838 9.384C4.0078 10.32 3.6958 11.472 3.6958 12.792C3.6958 13.92 3.9118 15.12 4.3678 16.368C4.7518 17.496 5.2558 18.48 5.8558 19.344C6.4558 20.184 6.9118 20.736 7.2958 21.048C7.8478 21.576 8.4238 21.84 8.9998 21.84ZM12.0238 6.456C12.0238 6.576 12.0238 6.696 12.0478 6.816C14.1358 7.008 16.1518 4.728 16.1518 2.544V2.16C15.6478 2.184 15.0958 2.328 14.5438 2.616C13.0078 3.384 12.0238 4.92 12.0238 6.456Z"
        fill={color}
      />
    </svg>
  );
}

export default AppleUltraLight;
