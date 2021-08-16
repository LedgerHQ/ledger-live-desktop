import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function SearchDollarThin({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.4439 15.804L21.3479 21.684L21.6839 21.348L15.8039 15.444C17.0999 14.052 17.9159 12.18 17.9159 10.116C17.9159 5.82001 14.4119 2.31601 10.1159 2.31601C5.81992 2.31601 2.31592 5.82001 2.31592 10.116C2.31592 14.412 5.81992 17.916 10.1159 17.916C12.1799 17.916 14.0519 17.1 15.4439 15.804ZM2.79592 10.116C2.79592 6.08401 6.08392 2.79601 10.1159 2.79601C14.1479 2.79601 17.4359 6.08401 17.4359 10.116C17.4359 14.148 14.1479 17.436 10.1159 17.436C6.08392 17.436 2.79592 14.148 2.79592 10.116ZM7.28392 11.172C7.30792 12.804 8.33992 13.812 9.87592 13.932V14.844H10.3559V13.932C11.8439 13.86 12.8759 13.02 12.8759 11.748C12.8759 10.596 12.0359 9.92401 10.7879 9.78001L10.3559 9.73201V6.63601C11.6039 6.70801 12.2759 7.45201 12.2759 8.70001H12.7559C12.7559 7.23601 11.8199 6.22801 10.3559 6.15601V5.24401H9.87592V6.15601C8.60392 6.27601 7.59592 7.09201 7.59592 8.26801C7.59592 9.32401 8.31592 9.97201 9.51592 10.116L9.87592 10.164V13.452C8.57992 13.332 7.78792 12.54 7.76392 11.172H7.28392ZM8.07592 8.26801C8.07592 7.33201 8.79592 6.73201 9.87592 6.63601V9.68401L9.56392 9.63601C8.55592 9.51601 8.07592 9.08401 8.07592 8.26801ZM10.3559 13.452V10.212L10.7399 10.26C11.8199 10.38 12.3959 10.86 12.3959 11.748C12.3959 12.756 11.6279 13.38 10.3559 13.452Z"
        fill={color}
      />
    </svg>
  );
}

export default SearchDollarThin;
