import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function FullnodeErrorRegular({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.8361 20.7361C11.0761 20.7361 11.2921 20.7121 11.5081 20.7121L13.1881 19.0321C12.4921 19.1041 11.7001 19.1521 10.8361 19.1521C6.90008 19.1521 4.69208 18.2401 4.69208 17.0641V15.4561C5.96408 16.3441 8.19608 16.8721 10.8361 16.8721C11.3641 16.8721 11.8681 16.8481 12.3721 16.8001L11.7001 16.1281L12.3721 15.4321C11.8921 15.4561 11.3641 15.4801 10.8361 15.4801C6.94808 15.4801 4.69208 14.5201 4.69208 13.2961V11.6881C5.96408 12.6001 8.19608 13.1041 10.8361 13.1041C13.4521 13.1041 15.6841 12.6001 16.9801 11.6881V13.7281L17.7001 14.4481L18.5401 13.6081V5.73606C18.5401 3.40806 15.2281 2.11206 10.8361 2.11206C6.56408 2.11206 3.13208 3.40806 3.13208 5.73606V17.0641C3.13208 19.3921 6.49208 20.7361 10.8361 20.7361ZM4.69208 9.52806V7.92006C5.96408 8.83206 8.19608 9.33606 10.8361 9.33606C13.4281 9.33606 15.6841 8.80806 16.9801 7.89606V9.52806C16.9801 10.7521 14.6521 11.7361 10.8361 11.7361C6.94808 11.7361 4.69208 10.7521 4.69208 9.52806ZM4.69208 5.73606C4.69208 4.58406 6.97208 3.67206 10.8361 3.67206C14.8201 3.67206 16.9801 4.58406 16.9801 5.73606C16.9801 7.00806 14.6521 7.94406 10.8361 7.94406C6.94808 7.94406 4.69208 7.00806 4.69208 5.73606ZM14.1241 20.8321L15.1561 21.8881L17.5081 19.5361L19.8361 21.8881L20.8681 20.8321L18.5401 18.5041L20.8681 16.1761L19.8361 15.1201L17.5081 17.4481L15.1561 15.1201L14.1241 16.1761L16.4521 18.5041L14.1241 20.8321Z"
        fill={color}
      />
    </svg>
  );
}

export default FullnodeErrorRegular;
