import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function BluetoothRegular({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0002 22.3201C17.4242 22.3201 19.8962 19.1281 19.9442 12.0001C19.8962 4.87205 17.4242 1.68005 12.0002 1.68005C6.57615 1.68005 4.10415 4.87205 4.05615 12.0001C4.10415 19.1281 6.57615 22.3201 12.0002 22.3201ZM7.53615 15.7681L11.2802 12.0001L7.53615 8.23205L8.54415 7.22405L11.5202 10.2961V3.09605L16.7282 8.47205L13.2002 12.0001L16.7282 15.5281L11.5202 20.9041V13.7041L8.54415 16.7761L7.53615 15.7681ZM12.9362 17.3521L14.6882 15.5281L12.9362 13.7041V17.3521ZM12.9362 10.2961L14.6882 8.47205L12.9362 6.64805V10.2961Z"
        fill={color}
      />
    </svg>
  );
}

export default BluetoothRegular;
