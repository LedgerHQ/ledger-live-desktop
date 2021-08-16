import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function NineCircledThin({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0001 20.88C16.9681 20.88 20.8801 16.848 20.8801 12C20.8801 7.032 16.9681 3.12 12.0001 3.12C7.03212 3.12 3.12012 7.032 3.12012 12C3.12012 16.968 7.03212 20.88 12.0001 20.88ZM3.60012 12C3.60012 7.296 7.29612 3.6 12.0001 3.6C16.7041 3.6 20.4001 7.296 20.4001 12C20.4001 16.584 16.7041 20.4 12.0001 20.4C7.29612 20.4 3.60012 16.704 3.60012 12ZM9.02412 10.44C9.02412 12.216 10.2721 13.536 12.0241 13.536C13.4401 13.536 14.4961 12.672 14.8321 11.4H14.8561C14.9761 13.92 14.4481 16.224 11.9761 16.224C10.5841 16.224 9.74412 15.456 9.52812 14.04H9.04812C9.26412 15.648 10.3921 16.704 11.9761 16.704C14.1361 16.704 15.3841 14.832 15.3601 11.904C15.3361 9.048 14.1121 7.344 12.0241 7.344C10.2721 7.344 9.02412 8.664 9.02412 10.44ZM9.50412 10.464V10.416C9.50412 8.856 10.4641 7.824 12.0001 7.824H12.0481C13.6561 7.824 14.5681 9 14.5681 10.416V10.464C14.5681 12 13.6321 13.056 12.0481 13.056H12.0001C10.4641 13.056 9.50412 12.024 9.50412 10.464Z"
        fill={color}
      />
    </svg>
  );
}

export default NineCircledThin;
