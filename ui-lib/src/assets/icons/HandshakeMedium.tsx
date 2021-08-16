import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function HandshakeMedium({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.5602 8.23191L11.1602 10.6079C10.9682 10.7759 10.7762 10.8959 10.5122 10.8959C9.88818 10.8959 9.55218 10.4159 9.55218 9.95991C9.55218 9.69591 9.67218 9.43191 9.81618 9.28791L12.2402 6.91191C12.5762 6.59991 13.0082 6.40791 13.4642 6.40791H15.3122C15.7682 6.40791 16.2002 6.59991 16.5362 6.91191L17.9282 8.27991C18.2642 8.61591 18.6962 8.78391 19.1522 8.78391H22.3202V6.98391H19.3922C19.3202 6.98391 19.2482 6.95991 19.2002 6.91191L17.9042 5.63991C17.2322 4.99191 16.2722 4.60791 15.3122 4.60791H8.68818C7.72818 4.60791 6.76818 4.99191 6.09618 5.63991L4.80018 6.91191C4.75218 6.95991 4.70418 6.98391 4.60818 6.98391H1.68018V8.78391H4.84818C5.30418 8.78391 5.73618 8.61591 6.07218 8.27991L7.46418 6.91191C7.80018 6.59991 8.23218 6.40791 8.68818 6.40791H10.5362L8.73618 8.18391C8.28018 8.63991 8.01618 9.31191 8.01618 9.93591C8.01618 11.3279 9.12018 12.4559 10.5122 12.4559C11.1602 12.4559 11.7602 12.2159 12.2402 11.7359L12.5282 11.4479L16.2962 15.2159L14.3762 17.0879C14.0642 17.3999 13.6322 17.5919 13.1762 17.5919H9.36018C8.90418 17.5919 8.47218 17.3999 8.16018 17.0879L5.64018 14.6159C5.30418 14.3039 4.87218 14.1119 4.41618 14.1119H1.68018V15.9119H4.17618C4.24818 15.9119 4.32018 15.9359 4.36818 15.9839L6.81618 18.3599C7.44018 18.9839 8.40018 19.3919 9.36018 19.3919H13.1762C14.1362 19.3919 15.0962 18.9839 15.7202 18.3599L18.2162 15.9119H22.3202V14.1119H17.4002L13.6562 10.3439L14.6642 9.33591L13.5602 8.23191Z"
        fill={color}
      />
    </svg>
  );
}

export default HandshakeMedium;
